import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'booth-ng';

  constructor(private overlay: OverlayContainer) {
  }

  ngOnInit(): void {
    this.overlay.getContainerElement().classList.add('darkMode')
  }
}
