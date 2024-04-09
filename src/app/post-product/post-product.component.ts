import { Component, OnInit } from '@angular/core';
import { ProductService } from './product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-product',
  templateUrl: './post-product.component.html',
  styleUrls: ['./post-product.component.css']
})
export class PostProductComponent implements OnInit {
  productData: any = {};
  productList: any[] = []; // Lista de produtos

  constructor(private productService: ProductService,private router: Router) { }

  ngOnInit(): void {
    this.productList = []; // Inicialize aqui, se necessário
    this.fetchProducts();
  }


  fetchProducts() {
    // Chamar o serviço para obter a lista de produtos
    this.productService.getProducts().subscribe(
      products => {
        this.productList = products;
      },
      error => {
        console.error('Erro ao obter produtos:', error);
      }
    );
  }

  addProduct() {
    // Verificar se algum campo obrigatório está vazio
    if (!this.productData.title || this.productData.title.trim() === '') {
      alert('Por favor, preencha o título do produto.');
      return; // Impedir a submissão do formulário se o título estiver vazio
    }
  
    // Você pode adicionar mais verificações para outros campos aqui, se necessário
  
    // Continuar com a adição do produto se todos os campos obrigatórios estiverem preenchidos
    this.productService.addProduct(this.productData)
      .subscribe(
        response => {
          console.log('Novo produto adicionado:', response);
          // Adicionar o produto à lista após adição bem-sucedida
          if (!Array.isArray(this.productList)) {
            this.productList = []; // Garantir que productList seja uma matriz
          }
          this.productList.push(response);
          // Limpar os campos do formulário após adicionar o produto
          this.productData = {};
        },
        error => {
          console.error('Erro ao adicionar produto:', error);
          // Adicionar lógica de tratamento de erro aqui, como exibir uma mensagem para o usuário.
        }
      );
  }

  redirectTo(route: string) {
    this.router.navigate([route]);
  }

  
}
