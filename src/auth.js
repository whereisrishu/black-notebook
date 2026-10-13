(() => {
  function getClient() { return window.BlackNotebookClient.getClient(); }
  async function getSession() {
    if (!window.BlackNotebookClient.configured) return null;
    const { data, error } = await getClient().auth.getSession();
    if (error) throw error;
    return data.session;
  }
  async function signIn(email, password) {
    const { data, error } = await getClient().auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.session;
  }
  async function signOut() {
    const { error } = await getClient().auth.signOut();
    if (error) throw error;
  }
  function onAuthStateChange(callback) {
    return getClient().auth.onAuthStateChange(callback);
  }
  window.BlackNotebookAuth = { getSession, signIn, signOut, onAuthStateChange };
})();

