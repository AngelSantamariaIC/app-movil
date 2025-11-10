import { Component } from '@angular/core';
import { IonicModule, Platform } from '@ionic/angular';
import { CommonModule } from '@angular/common';

// --- 1. IMPORTA EL STATUS BAR Y EL STYLE ---
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      
      // --- 2. VERIFICA SI ES MÓVIL (NO WEB) ---
      if (this.platform.is('capacitor')) {
        
        // --- 3. AÑADE ESTA LÍNEA ---
        // Style.Dark pone el texto y los íconos en NEGRO
        StatusBar.setStyle({ style: Style.Dark }); 
      }
      
    });
  }
}