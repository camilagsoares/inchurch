import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from './product.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditModalComponent } from '../edit-modal/edit-modal.component'; 

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  productId: string | null = null;
  productDetails: any = { selectedImage: '', images: [] }; // Começa com uma imagem vazia
  isEditingPrice: boolean = false;
  isEditingStock: boolean = false;
  isEditingCategory: boolean = false;
  isEditingBrand: boolean = false;
  isEditingRating: boolean = false;
  isEditing: boolean = false;
  isEditingTitle: boolean = false;
  editedTitle: string = '';

  constructor(private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
    ) { }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.getProductDetails(this.productId);
    }
  }

  getProductDetails(productId: string): void {
    this.productService.getProductById(productId)
      .subscribe(product => {
        this.productDetails = product;
        this.editedTitle = product.title;
        // Definir a primeira imagem como a imagem selecionada
        if (product.images.length > 0) {
          this.productDetails.selectedImage = product.images[0];
        }
      });
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  enableEditing() {
    this.isEditing = true;
    this.isEditingTitle = true;
  }



  saveChanges() {
    if (this.productId) {
      const updatedData = {
        title: this.editedTitle
      };

      this.productService.updateProduct(this.productId, updatedData)
        .subscribe(
          (updatedProduct) => {
            this.productDetails.title = updatedProduct.title;
            this.isEditing = false;
            this.isEditingTitle = false;
            this.cdr.detectChanges();
          },
          (error) => {
            console.error('Erro ao atualizar produto:', error);
          }
        );
    }

  }



  enableEditingTitle() {
    this.isEditingTitle = true;
  }

  saveTitle() {
    if (this.productId) {
      const updatedData = {
        title: this.editedTitle
        // Adicione outros campos editáveis aqui, se necessário
      };

      this.productService.updateProduct(this.productId, updatedData)
        .subscribe(
          (updatedProduct) => {
            this.productDetails.title = updatedProduct.title;
            // Atualize outros campos editáveis aqui, se necessário
            this.isEditingTitle = false;
          },
          (error) => {
            console.error('Erro ao atualizar produto:', error);
          }
        );
    }
  }

  cancelEditTitle() {
    this.editedTitle = this.productDetails.title;
    // Reverta quaisquer outras alterações feitas em outros campos aqui, se necessário
    this.isEditingTitle = false;
  }


  openModal() {
    this.isEditing = true;
    // Inicialize os campos editáveis com os valores atuais
    this.editedTitle = this.productDetails.title;
  }

  closeModal() {
    this.isEditing = false;
  }



  cancelEdit() {
    // Lógica para cancelar a edição
    this.closeModal();
  }

  openEditModal(): void {
    const dialogRef = this.dialog.open(EditModalComponent, {
      width: '500px',
      height: '240px',
     // Defina o tamanho do modal conforme necessário
      data: { title: this.productDetails.title /* outros campos aqui */ }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        // Atualize os dados com as alterações, se necessário
        this.productDetails.title = result.title;
        // Atualize outros campos conforme necessário
      }
    });
  }
}