import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { AnimatedEllipsis } from '@/components/chat/AnimatedEllipsis';
import { useMode } from '@/contexts/ModeContext';

export function AssistantLoading() {
  const { mode } = useMode();
  return (
    <div className="flex w-full p-1">
      <div className="mr-2 mt-1">
        <Avatar
          className="h-9 w-9 border bg-adam-neutral-950"
          style={
            mode === "architecture"
              ? { borderColor: "#C77DFF", padding: "0.15rem" }
              : { borderColor: undefined, padding: "0.375rem" }
          }
        >
          <AvatarImage
            src={
              mode === "architecture"
                ? `${import.meta.env.BASE_URL}/logos/Screenshot 2026-02-16 at 10.57.01 PM.svg`
                : `${import.meta.env.BASE_URL}/adam-logo.svg`
            }
            alt={mode === "architecture" ? "Parametrix" : "Adam"}
            className={mode === "architecture" ? "rounded-sm object-contain" : ""}
          />
        </Avatar>
      </div>
      <div className="flex max-w-[80%] flex-col items-center justify-center gap-2 rounded-lg bg-adam-neutral-800 p-3">
        <AnimatedEllipsis color="adam-neutral" />
      </div>
    </div>
  );
}
