(() => {
  const LOCAL_KEY = "black-notebook-v1";
  const RECOVERY_KEY = "black-notebook-local-recovery-v1";
  const clone = (value) => JSON.parse(JSON.stringify(value ?? {}));
  function parse(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "{}");
      return value && typeof value === "object" && !Array.isArray(value) ? value : {};
    } catch { return {}; }
  }
  function hasUserContent(state) {
    for (const key of ["answers", "checked", "custom", "plan", "entries"]) {
      const value = state?.[key];
      if (value && typeof value === "object" && Object.values(value).some((item) => {
        if (typeof item === "string") return item.trim().length > 0;
        if (Array.isArray(item)) return item.length > 0;
        if (item && typeof item === "object") return hasUserContent(item);
        return Boolean(item);
      })) return true;
    }
    return false;
  }
  function saveLocal(state) { localStorage.setItem(LOCAL_KEY, JSON.stringify(state)); }
  function preserveRecovery(state) {
    if (hasUserContent(state) && !localStorage.getItem(RECOVERY_KEY)) {
      localStorage.setItem(RECOVERY_KEY, JSON.stringify(state));
    }
  }
  async function load(userId) {
    const { data, error } = await window.BlackNotebookClient.getClient()
      .from("notebook_state").select("state,updated_at").eq("user_id", userId).maybeSingle();
    if (error) throw error;
    return data;
  }
  async function insert(userId, state) {
    const { data, error } = await window.BlackNotebookClient.getClient()
      .from("notebook_state").insert({ user_id: userId, state: clone(state) }).select("state,updated_at").single();
    if (error) throw error;
    return data;
  }
  async function save(userId, state, expectedUpdatedAt) {
    if (!expectedUpdatedAt) return insert(userId, state);
    const { data, error } = await window.BlackNotebookClient.getClient()
      .from("notebook_state")
      .update({ state: clone(state), updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("updated_at", expectedUpdatedAt)
      .select("state,updated_at")
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      const conflict = new Error("This device and the cloud changed separately. Choose which copy to keep.");
      conflict.name = "NotebookConflictError";
      throw conflict;
    }
    return data;
  }
  window.BlackNotebookStore = {
    localKey: LOCAL_KEY,
    recoveryKey: RECOVERY_KEY,
    readLocal: () => parse(LOCAL_KEY),
    readRecovery: () => parse(RECOVERY_KEY),
    hasUserContent,
    saveLocal,
    preserveRecovery,
    load,
    insert,
    save,
  };
})();

