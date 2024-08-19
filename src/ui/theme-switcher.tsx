import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/utils/misc";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/ui/select";
import { useEffect, useState } from "react";

const themes = ["light", "dark", "system"] as const;

const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark" | "system">(
    localStorage.theme || "system",
  );
  const [initialized, setInitialized] = useState(false);

  // A similar script is inlined in the <head> of index.html.
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      return;
    }
    if (currentTheme === "system") {
      localStorage.removeItem("theme");
    } else {
      localStorage.theme = currentTheme;
    }
    if (
      currentTheme === "dark" ||
      (currentTheme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    }
  }, [currentTheme]);

  return [currentTheme, setCurrentTheme] as const;
};

export function ThemeSwitcher({ triggerClass }: { triggerClass?: string }) {
  const [currentTheme, setCurrentTheme] = useTheme();
  return (
    <Select
      value={currentTheme}
      onValueChange={(theme) =>
        setCurrentTheme(theme as (typeof themes)[number])
      }
    >
      <SelectTrigger
        className={cn(
          "h-6 rounded border-primary/20 bg-secondary !px-2 hover:border-primary/40",
          triggerClass,
        )}
      >
        <div className="flex items-start gap-2">
          {currentTheme === "light" ? (
            <Sun className="h-[14px] w-[14px]" />
          ) : currentTheme === "dark" ? (
            <Moon className="h-[14px] w-[14px]" />
          ) : (
            <Monitor className="h-[14px] w-[14px]" />
          )}
          <span className="text-xs font-medium">
            {currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}
          </span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {themes.map((theme) => (
          <SelectItem
            key={theme}
            value={theme}
            className={`text-sm font-medium text-primary/60 ${theme === currentTheme && "text-primary"}`}
          >
            {theme && theme.charAt(0).toUpperCase() + theme.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function ThemeSwitcherHome() {
  const [, setCurrentTheme] = useTheme();
  return (
    <div className="flex gap-3">
      {themes.map((theme) => (
        <button key={theme} name="theme" onClick={() => setCurrentTheme(theme)}>
          {theme === "light" ? (
            <Sun className="h-4 w-4 text-primary/80 hover:text-primary" />
          ) : theme === "dark" ? (
            <Moon className="h-4 w-4 text-primary/80 hover:text-primary" />
          ) : (
            <Monitor className="h-4 w-4 text-primary/80 hover:text-primary" />
          )}
        </button>
      ))}
    </div>
  );
}
