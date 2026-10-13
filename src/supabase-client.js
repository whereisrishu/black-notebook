(() => {
  const config = window.BLACK_NOTEBOOK_CONFIG || {};
  const configured = Boolean(config.supabaseUrl && config.supabasePublishableKey);
  let client = null;
  function getClient() {
    if (!configured) return null;
    if (!window.supabase?.createClient) throw new Error("Supabase browser SDK did not load. Check your internet connection and reload.");
    if (!client) client = window.supabase.createClient(config.supabaseUrl, config.supabasePublishableKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
    return client;
  }
  window.BlackNotebookClient = { configured, getClient };
})();

