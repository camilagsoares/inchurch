import { Component, OnInit,Inject  } from '@angular/core';
import { MAT_DIALOG_DATA ,MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.css']
})
export class EditModalComponent implements OnInit {
  editedData: any;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditModalComponent>
  ) {
    // Inicialize os campos editáveis com os dados recebidos
    this.editedData = { ...data };
  }

  ngOnInit(): void {
  }

  saveChanges(): void {
    // Feche o modal e retorne os dados editados
    this.dialogRef.close(this.editedData);
  }

  cancelEdit(): void {
    // Feche o modal sem salvar alterações
    this.dialogRef.close();
  }
}
