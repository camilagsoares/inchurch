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
  selectedBrand: string = '';
  searchTerm: string = '';
  categories: string[] = [];
  brands: string[] = [];
  filteredProducts: any[] = [];
  currentPage: number = 1;
  pageSize: number = 14;
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
        this.extractBrands(data.products);
        this.pageSize = Math.ceil(this.filteredProducts.length / Math.ceil(this.filteredProducts.length / 15));

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

    const trimmedSearchTerm = this.searchTerm.trim();
    if (trimmedSearchTerm) {
      this.filteredProducts = filteredByCategoryAndBrand.filter((product: any) =>
        product.title.toLowerCase().includes(trimmedSearchTerm.toLowerCase())
      );
    } else {
      this.filteredProducts = filteredByCategoryAndBrand;
    }

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


  deleteProduct(event: Event, productId: number) {
    event.stopPropagation();

    fetch(`https://dummyjson.com/products/${productId}`, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(deletedProduct => {
        if (deletedProduct.isDeleted && deletedProduct.deletedOn) {
          console.log(`Product ${productId} deleted on ${deletedProduct.deletedOn}`);

          this.filteredProducts = this.filteredProducts.filter((product: any) => product.id !== productId);
          this.snackBar.open(`Produto ${productId} deletado com sucesso`, 'Close', {
            duration: 3000,
          });
        } else {
          console.error(`Failed to delete product ${productId}`);

          this.snackBar.open(`Failed to delete product ${productId}`, 'Close', {
            duration: 3000,
          });
        }
      })
      .catch(error => {
        console.error(`Error deleting product ${productId}:`, error);

        this.snackBar.open(`Error deleting product ${productId}`, 'Close', {
          duration: 3000,
        });
      });
  }

  goToProductDetails(productId: number) {
    this.router.navigate(['/product', productId]);
  }

  redirectTo(route: string) {
    this.router.navigate([route]);
  }

  addToCart(productId: number) {
    fetch('https://dummyjson.com/products/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: productId
      })
    })
      .then(res => res.json())
      .then(newProduct => {
        console.log('Product added to cart:', newProduct);

      })
      .catch(error => {
        console.error('Error adding product to cart:', error);

      });
  }
}
