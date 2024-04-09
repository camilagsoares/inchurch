import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  data: any;
  selectedCategory: string = '';
  selectedBrand: string = ''; // Adicionando variável para armazenar a marca selecionada
  searchTerm: string = '';
  categories: string[] = [];
  brands: string[] = []; // Adicionando array para armazenar marcas
  filteredProducts: any[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  selectedProduct: any = null;
  
  constructor(private router: Router, private snackBar: MatSnackBar) { }


  ngOnInit() {
    this.getData();
  }

  getData() {
    fetch('https://dummyjson.com/products')
      .then(res => res.json())
      .then(data => {
        this.data = data;
        this.filteredProducts = data.products;
        this.extractCategories(data.products);
        this.extractBrands(data.products); // Extrair marcas

        console.log(data)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  extractCategories(products: any[]) {
    this.categories = Array.from(new Set(products.map(product => product.category)));
  }



  extractBrands(products: any[]) {
    this.brands = Array.from(new Set(products.map(product => product.brand)));
  }


 filterProducts() {
    let filteredByCategoryAndBrand = this.data.products;

    if (this.selectedCategory) {
      filteredByCategoryAndBrand = filteredByCategoryAndBrand.filter((product: any) =>
        product.category.toLowerCase().includes(this.selectedCategory.toLowerCase())
      );
    }

    if (this.selectedBrand) {
      filteredByCategoryAndBrand = filteredByCategoryAndBrand.filter((product: any) =>
        product.brand.toLowerCase().includes(this.selectedBrand.toLowerCase())
      );
    }

    const trimmedSearchTerm = this.searchTerm.trim(); // Remover espaços em branco extras
    if (trimmedSearchTerm) {
      this.filteredProducts = filteredByCategoryAndBrand.filter((product: any) =>
        product.title.toLowerCase().includes(trimmedSearchTerm.toLowerCase())
      );
    } else {
      this.filteredProducts = filteredByCategoryAndBrand;
    }

    // Atualize as páginas ao filtrar
    this.currentPage = 1;
  }

  get paginatedProducts(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }

  previousPage() {
    this.currentPage--;
  }

  nextPage() {
    this.currentPage++;
  }


  deleteProduct(productId: number) {
    
    fetch(`https://dummyjson.com/products/${productId}`, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(deletedProduct => {
        if (deletedProduct.isDeleted && deletedProduct.deletedOn) {
          console.log(`Product ${productId} deleted on ${deletedProduct.deletedOn}`);
          // Remove o produto excluído da lista filteredProducts
          this.filteredProducts = this.filteredProducts.filter((product: any) => product.id !== productId);
          // Exibe a mensagem de sucesso
          this.snackBar.open(`Produto ${productId} deletado com sucesso`, 'Close', {
            duration: 3000, // Duração da mensagem em milissegundos (3 segundos neste caso)
          });
        } else {
          console.error(`Failed to delete product ${productId}`);
          // Exibe uma mensagem de erro caso falhe a exclusão
          this.snackBar.open(`Failed to delete product ${productId}`, 'Close', {
            duration: 3000, // Duração da mensagem em milissegundos (3 segundos neste caso)
          });
        }
      })
      .catch(error => {
        console.error(`Error deleting product ${productId}:`, error);
        // Exibe uma mensagem de erro caso ocorra um erro durante a exclusão
        this.snackBar.open(`Error deleting product ${productId}`, 'Close', {
          duration: 3000, // Duração da mensagem em milissegundos (3 segundos neste caso)
        });
      });
  }

  goToProductDetails(productId: number) {
    this.router.navigate(['/product', productId]);
  }

  redirectTo(route: string) {
    this.router.navigate([route]);
  }

}
