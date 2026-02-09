import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface HistoryItem {
  id: string;
  message: string;
  level: string;
  createdAt: string;
}

export function PushTab() {
  const [message, setMessage] = useState("");
  const [level, setLevel] = useState("info");
  const [isSending, setIsSending] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
        const res = await fetch("/api/admin/broadcast/history");
        if (res.ok) setHistory(await res.json());
    } catch(e) {}
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;

    setIsSending(true);
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, level }),
      });

      if (res.ok) {
        setAlert({ type: "success", message: `Notification Bulle activée pour 24h !` });
        setMessage("");
        fetchHistory(); // Refresh history
      } else {
        throw new Error("Erreur d'envoi");
      }
    } catch (e) {
      setAlert({ type: "error", message: "Erreur lors de la création." });
    } finally {
      setIsSending(false);
      setTimeout(() => setAlert(null), 3000);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Alert */}
      {alert && (
        <div className={`admin-alert admin-alert-${alert.type}`}>
          <span className="text-xl">{alert.type === "success" ? "✓" : "⚠"}</span>
          <p>{alert.message}</p>
        </div>
      )}

      <div className="admin-glass rounded-2xl p-6">
         {/* ... (Create Form remains same) */}
         <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
               <span className="text-3xl">💬</span> Notifications Bulles (Site)
            </h3>
            <div className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
               Diffusion : Tout le Monde
            </div>
         </div>
         
         <p className="mb-6 text-slate-500 dark:text-slate-400 text-sm">
            Ces messages s'affichent sous forme de bulles flottantes sur le site de tous les visiteurs pendant 24h.
         </p>

         <form onSubmit={handleSend} className="space-y-4 max-w-xl">
            
            <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type de Message</label>
               <select 
                 value={level}
                 onChange={e => setLevel(e.target.value)}
                 className="admin-input cursor-pointer"
               >
                 <option value="info">📢 Info Générale (Bleu)</option>
                 <option value="success">🎉 Succès / Promo (Fête)</option>
                 <option value="urgent">🚨 Urgent / Important (Rouge)</option>
                 <option value="warning">⚠️ Attention (Jaune)</option>
               </select>
            </div>

            <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message (Court et Percutant)</label>
               <textarea 
                 required
                 value={message}
                 onChange={e => setMessage(e.target.value)}
                 rows={3}
                 placeholder="Ex: Plus que 2 heures pour profiter du code promo !"
                 className="admin-input" 
                 maxLength={100}
               />
               <p className="text-xs text-right text-slate-400 mt-1">{message.length}/100 caractères</p>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isSending || message.length === 0}
                className="admin-btn-primary w-full py-3 flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>🚀</span> Diffuser sur le site (24h)
                  </>
                )}
              </button>
            </div>
         </form>
      </div>

      {/* History Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview */}
        <div className="admin-glass rounded-2xl p-6 h-fit">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Aperçu en Direct</h4>
            <div className="bg-zinc-900 border border-blue-500/30 p-4 rounded-xl shadow-lg relative max-w-xs mx-auto lg:mx-0">
                <div className="flex gap-3">
                    <span className="text-2xl">
                        {level === 'urgent' ? '🚨' : level === 'success' ? '🎉' : level === 'warning' ? '⚠️' : '📢'}
                    </span>
                    <div>
                        <p className="text-white font-semibold text-sm">{message || "Votre message ici..."}</p>
                        <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest">Message Admin</p>
                    </div>
                </div>
            </div>
            <p className="text-xs text-center text-slate-400 mt-4">C'est exactement ce que verront vos visiteurs.</p>
        </div>

        {/* History List */}
        <div className="admin-glass rounded-2xl p-6">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex justify-between items-center">
                <span>Historique (Dernières 24h)</span>
                <button onClick={fetchHistory} className="text-xs text-blue-500 hover:text-blue-600">Actualiser</button>
            </h4>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {history.length === 0 ? (
                    <p className="text-sm text-slate-400 italic">Aucune notification récente.</p>
                ) : (
                    history.map(item => (
                        <div key={item.id} className="p-3 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700/50">
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    item.level === 'urgent' ? 'bg-red-100 text-red-600' :
                                    item.level === 'success' ? 'bg-green-100 text-green-600' :
                                    'bg-blue-100 text-blue-600'
                                } uppercase font-bold text-[10px]`}>
                                    {item.level}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                    {format(new Date(item.createdAt), "HH:mm", { locale: fr })}
                                </span>
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium line-clamp-2">{item.message}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
