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
  productDetails: any = { selectedImage: '', images: [] }; 
  isEditingPrice: boolean = false;
  isEditingStock: boolean = false;
  isEditingCategory: boolean = false;
  isEditingBrand: boolean = false;
  isEditingRating: boolean = false;
  isEditing: boolean = false;
  isEditingTitle: boolean = false;
  editedTitle: string = '';
  isEditingDescription: boolean = false;
editedDescription: string = '';

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
      };

      this.productService.updateProduct(this.productId, updatedData)
        .subscribe(
          (updatedProduct) => {
            this.productDetails.title = updatedProduct.title;
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
    this.isEditingTitle = false;
  }


  openModal() {
    this.isEditing = true;
    this.editedTitle = this.productDetails.title;
    this.editedDescription = this.productDetails.description;

  }

  closeModal() {
    this.isEditing = false;
  }

  cancelEdit() {
    this.closeModal();
  }

  openEditModal(): void {
    const dialogRef = this.dialog.open(EditModalComponent, {
      width: '500px',
      height: '270px',
     data: { title: this.productDetails.title, description: this.productDetails.description /* outros campos aqui */ }

    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.productDetails.title = result.title;
        this.productDetails.description = result.description;
      }
    });
  }

  enableEditingDescription() {
    this.isEditingDescription = true;
  }
  
  saveDescription() {
    if (this.productId) {
      const updatedData = {
        description: this.editedDescription
      };
  
      this.productService.updateProduct(this.productId, updatedData)
        .subscribe(
          (updatedProduct) => {
            this.productDetails.description = updatedProduct.description;
            this.isEditingDescription = false;
          },
          (error) => {
            console.error('Erro ao atualizar produto:', error);
          }
        );
    }
  }
  
  cancelEditDescription() {
    this.editedDescription = this.productDetails.description;
    this.isEditingDescription = false;
  }
}