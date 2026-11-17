// Synchro famille via Firebase (Auth Google + Firestore), 100 % côté navigateur.
// Modèle : families/{fid} (nom, emails, managers) + sous-collections members, sessions, boosts, challenges, grants.
// Les super-admins (qui peuvent créer des familles) sont les documents admins/{email}, posés à la main dans la console.
// Expose window.HTCloud et émet l'événement « htcloud » à chaque changement d'état.
const cfg = window.HT_CONFIG || {};
const listeners = new Set();
let fb = null, auth = null, db = null;

const HTCloud = window.HTCloud = {
  state: 'off',          // off | loading | signedOut | signedIn | error
  user: null, isAdmin: false, error: null,
  onState(cb){ listeners.add(cb); cb(HTCloud); return () => listeners.delete(cb); },
  async signIn(){}, async signOut(){ if (auth) await fb.auth.signOut(auth); },
  put(){}, del(){}, watch(){ return () => {}; }, watchFamilies(){ return () => {}; }, watchDoc(){ return () => {}; },
};
function setState(s, extra = {}){
  Object.assign(HTCloud, {state: s}, extra);
  listeners.forEach(cb => { try{ cb(HTCloud); }catch(e){ console.error(e); } });
  window.dispatchEvent(new CustomEvent('htcloud', {detail: HTCloud}));
}
// Retire les champs internes (préfixés par _) et les undefined avant l'envoi
const clean = o => JSON.parse(JSON.stringify(o, (k, v) => k.startsWith('_') ? undefined : v));

async function init(){
  if (!cfg.firebase) { setState('off'); return; }
  setState('loading');
  try{
    const base = `https://www.gstatic.com/firebasejs/${cfg.firebaseVersion || '13.2.0'}/`;
    const [app, authMod, fs] = await Promise.all([
      import(base + 'firebase-app.js'), import(base + 'firebase-auth.js'), import(base + 'firebase-firestore.js')
    ]);
    fb = {app, auth: authMod, fs};
    const a = app.initializeApp(cfg.firebase);
    auth = authMod.getAuth(a);
    auth.languageCode = 'fr';
    try{ db = fs.initializeFirestore(a, {localCache: fs.persistentLocalCache({tabManager: fs.persistentMultipleTabManager()})}); }
    catch(e){ db = fs.getFirestore(a); }

    HTCloud.signIn = async () => {
      const provider = new authMod.GoogleAuthProvider();
      provider.setCustomParameters({prompt: 'select_account'});
      try{ await authMod.signInWithPopup(auth, provider); }
      catch(e){
        if (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment')
          await authMod.signInWithRedirect(auth, provider);
        else if (e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') throw e;
      }
    };
    // path = chemin de collection, ex. "families/abc/sessions"
    HTCloud.put = (path, obj) => fs.setDoc(fs.doc(db, path, obj.id), {...clean(obj), updatedAt: fs.serverTimestamp(), by: auth.currentUser?.uid || null})
      .catch(e => { console.warn('put', path, e); HTCloud.lastError = e.message; });
    HTCloud.del = (path, id) => fs.deleteDoc(fs.doc(db, path, id)).catch(e => console.warn('del', path, e));
    const strip = d => { const x = d.data(); delete x.updatedAt; if (!x.id) x.id = d.id; return x; };
    HTCloud.watch = (path, opt, cb) => {
      const ref = fs.collection(db, path);
      const q = opt && opt.field ? fs.query(ref, fs.where(opt.field, '>=', opt.since)) : ref;
      return fs.onSnapshot(q, snap => cb(snap.docs.map(strip)), e => console.warn('watch', path, e));
    };
    HTCloud.watchDoc = (path, id, cb) => fs.onSnapshot(fs.doc(db, path, id), d => cb(d.exists() ? strip(d) : null), e => console.warn('watchDoc', path, e));
    // Familles visibles : toutes pour un super-admin, sinon celles où mon email figure
    HTCloud.watchFamilies = cb => {
      const ref = fs.collection(db, 'families');
      const q = HTCloud.isAdmin ? ref : fs.query(ref, fs.where('emails', 'array-contains', HTCloud.user.email));
      return fs.onSnapshot(q, snap => cb(snap.docs.map(strip)), e => { console.warn('families', e); cb([]); });
    };

    authMod.onAuthStateChanged(auth, async user => {
      if (!user) { setState('signedOut', {user: null, isAdmin: false}); return; }
      const email = (user.email || '').toLowerCase();
      let isAdmin = false;
      try{ isAdmin = (await fs.getDoc(fs.doc(db, 'admins', email))).exists(); }catch(e){}
      setState('signedIn', {isAdmin, user: {uid: user.uid, name: user.displayName, email, photo: user.photoURL}});
    });
  }catch(e){
    console.error(e); setState('error', {error: e.message});
  }
}
init();
