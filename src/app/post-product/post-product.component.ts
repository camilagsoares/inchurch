import { Component, OnInit } from '@angular/core';
import { ProductService } from './product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-product',
  templateUrl: './post-product.component.html',
  styleUrls: ['./post-product.component.css']
})
export class PostProductComponent implements OnInit {
  productData: any = {
    title: '',
    price: 0,
    description: '',
    photo: ''
  };
  productList: any[] = [];
  showProductList: boolean = false;

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts() {
    this.productService.getProducts().subscribe(
      products => {
        this.productList = Array.isArray(products) ? products : [];
        this.showProductList = this.productList.length > 0;
      },
      error => {
        console.error('Erro ao obter produtos:', error);
      }
    );
  }

  addProduct() {
    if (!this.productData.title || this.productData.title.trim() === '') {
      alert('Por favor, preencha o título do produto.');
      return;
    }

    if (!this.productData.price || this.productData.price <= 0) {
      alert('Por favor, preencha um preço válido para o produto.');
      return;
    }

    if (!this.productData.description || this.productData.description.trim() === '') {
      alert('Por favor, preencha a descrição do produto.');
      return;
    }

    this.productService.addProduct(this.productData)
      .subscribe(
        response => {
          console.log('Novo produto adicionado:', response);
          this.productList.push(response);
          this.showProductList = true;
          this.productData = {
            title: '',
            price: 0,
            description: '',
            photo: ''
          };
        },
        error => {
          console.error('Erro ao adicionar produto:', error);
        }
      );
  }

  redirectTo(route: string) {
    this.router.navigate([route]);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
  }
}
