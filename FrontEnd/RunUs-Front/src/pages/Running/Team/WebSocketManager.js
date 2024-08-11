// WebSocketManager.js
class WebSocketManager {
  constructor() {
    if (WebSocketManager.instance) {
      return WebSocketManager.instance;
    }

    this.ws = null;
    this.listeners = {};
    WebSocketManager.instance = this;
  }

  connect(roomId) {
    if (this.ws) {
      this.ws.close();
    }

    this.ws = new WebSocket(`wss://i11e103.p.ssafy.io:8003/ws/chat?roomId=${roomId}`);

    this.ws.onopen = () => {
      console.log("WebSocket connection opened");
      this.notifyListeners("open");
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received message:", data);
      this.notifyListeners("message", data);
    };

    this.ws.onclose = () => {
      console.log("WebSocket connection closed");
      this.notifyListeners("close");
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.notifyListeners("error", error);
    };
  }

  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected.");
    }
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  notifyListeners(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

const instance = new WebSocketManager();
export default instance;
