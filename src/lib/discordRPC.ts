// Discord Rich Presence Integration
interface DiscordActivity {
  details: string;
  state: string;
  largeImageKey?: string;
  largeImageText?: string;
  smallImageKey?: string;
  smallImageText?: string;
  startTimestamp?: number;
}

class DiscordRPCManager {
  private isConnected = false;
  private startTime = Date.now();
  private currentFile = "";
  private currentLanguage = "";

  async connect() {
    // For web/mobile, we'll use Discord's WebSocket gateway
    // In a real native app, you'd use discord-rpc package
    try {
      this.isConnected = true;
      this.startTime = Date.now();
      console.log("Discord RPC connected");
    } catch (error) {
      console.error("Failed to connect to Discord RPC:", error);
    }
  }

  async updateActivity(fileName: string, language: string, linesOfCode: number) {
    if (!this.isConnected) {
      await this.connect();
    }

    this.currentFile = fileName;
    this.currentLanguage = language;

    const activity: DiscordActivity = {
      details: `Editing ${fileName}`,
      state: `${language.toUpperCase()} • ${linesOfCode} lines`,
      largeImageKey: "codeflow_logo",
      largeImageText: "CodeFlow - Code Editor",
      smallImageKey: this.getLanguageIcon(language),
      smallImageText: language,
      startTimestamp: this.startTime,
    };

    // Send to Discord (simplified for demo)
    console.log("Discord RPC Activity:", activity);
    
    // In production, you'd call Discord's API here
    // For now, we'll store it for display
    this.storeActivity(activity);
  }

  private getLanguageIcon(language: string): string {
    const icons: Record<string, string> = {
      python: "python",
      lua: "lua",
      javascript: "javascript",
      typescript: "typescript",
      html: "html",
      css: "css",
      json: "json",
    };
    return icons[language.toLowerCase()] || "code";
  }

  private storeActivity(activity: DiscordActivity) {
    // Store in localStorage for persistence
    localStorage.setItem("discord-rpc-activity", JSON.stringify(activity));
  }

  clearActivity() {
    this.currentFile = "";
    this.currentLanguage = "";
    localStorage.removeItem("discord-rpc-activity");
  }

  disconnect() {
    this.isConnected = false;
    this.clearActivity();
  }
}

export const discordRPC = new DiscordRPCManager();
