import { Loader2 } from "lucide-react";

interface LoaderProps {
  text?: string;
  size?: number;
  fullScreen?: boolean;
}

export const Loader = ({
  text,
  size = 50,
  fullScreen = false,
}: LoaderProps) => {
  const content = (
    <div className="flex items-center gap-2 text-[#00659B]">
      <Loader2
        className="animate-spin"
        style={{ width: size, height: size }}
      />
      {text && (
        <span className="text-sm font-semibold text-[#00659B]">
          {text}
        </span>
      )}
    </div>
  );

  if (!fullScreen) return content;

  return (
    <div className="min-h-screen flex items-center justify-center">
      {content}
    </div>
  );
};