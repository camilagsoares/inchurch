import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from './product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  productId: string | null = null;
  productDetails: any = { selectedImage: '', images: [] }; // Começa com uma imagem vazia

  isEditing: boolean = false;
  isEditingTitle: boolean = false;
  editedTitle: string = '';

  constructor(private route: ActivatedRoute, 
              private productService: ProductService, 
              private router: Router,
              private cdr: ChangeDetectorRef) { }

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

  // moveSlider(direction: string) {
  //   const images = this.productDetails.images;
  //   const currentIndex = images.indexOf(this.productDetails.selectedImage);
  //   if (direction === 'next') {
  //     const nextIndex = (currentIndex + 1) % images.length;
  //     this.productDetails.selectedImage = images[nextIndex];
  //   } else if (direction === 'prev') {
  //     const prevIndex = (currentIndex - 1 + images.length) % images.length;
  //     this.productDetails.selectedImage = images[prevIndex];
  //   }
  // }
}