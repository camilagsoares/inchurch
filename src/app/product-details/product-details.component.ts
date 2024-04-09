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
  productDetails: any;
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
        this.editedTitle = product.title; // Initialize editedTitle with current title
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
        title: this.editedTitle,
        // Adicione outras propriedades atualizadas conforme necessário
      };
  
      this.productService.updateProduct(this.productId, updatedData)
        .subscribe(
          (updatedProduct) => {
            // A edição foi bem-sucedida, a resposta da API deve conter o produto atualizado
            console.log('Produto atualizado com sucesso:', updatedProduct);
            this.productDetails = updatedProduct;
            this.isEditing = false;
            // Forçar a detecção de mudanças
            this.cdr.detectChanges();
          },
          (error) => {
            // Houve um erro ao tentar atualizar o produto
            console.error('Erro ao atualizar produto:', error);
            // Você pode exibir uma mensagem de erro para o usuário aqui
          }
        );
    }
  }
}
