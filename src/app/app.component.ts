import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogModalComponent } from './components/dialog-modal/dialog-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'material-projects';
  constructor(private dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogModalComponent, {
      width: '400px',
      data: { message: 'Dialog opened!' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      // Do something with the result
    });
  }
}
