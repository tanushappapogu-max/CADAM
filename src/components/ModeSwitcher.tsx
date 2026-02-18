import { useMode } from "@/contexts/ModeContext";
import { Building2, Cog } from "lucide-react";

export function ModeSwitcher() {
  const { mode, toggleMode } = useMode();

  return (
    <div className="flex items-center justify-center gap-1 rounded-lg bg-adam-neutral-950 p-1">
      <button
        onClick={() => mode !== "engineering" && toggleMode()}
        className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
          mode === "engineering"
            ? "bg-adam-blue text-white"
            : "text-adam-neutral-400 hover:text-adam-neutral-200"
        }`}
      >
        <Cog className="h-3.5 w-3.5" />
        <span>Eng</span>
      </button>
      <button
        onClick={() => mode !== "architecture" && toggleMode()}
        className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
          mode === "architecture"
            ? "text-white"
            : "text-adam-neutral-400 hover:text-adam-neutral-200"
        }`}
        style={
          mode === "architecture"
            ? { backgroundColor: "#C77DFF" }
            : undefined
        }
      >
        <Building2 className="h-3.5 w-3.5" />
        <span>Arch</span>
      </button>
    </div>
  );
}
