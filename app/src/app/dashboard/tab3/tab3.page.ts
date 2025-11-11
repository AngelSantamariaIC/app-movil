import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tab3',
  standalone: true,
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class Tab3Page {

  message: string = '';
  chatHistory: { role: string; content: string }[] = [];

  constructor() {}

  sendMessage() {
    if (!this.message.trim()) return;

    // Usuario envía mensaje
    this.chatHistory.push({
      role: 'user',
      content: this.message
    });

    const userMessage = this.message;
    this.message = '';

    // Aquí puedes conectar tu backend de IA
    setTimeout(() => {
      this.chatHistory.push({
        role: 'ai',
        content: `Recibí tu mensaje: "${userMessage}". Pronto te respondo con IA real.`
      });
    }, 500);
  }
}
