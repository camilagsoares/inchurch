import { Component, TemplateRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/login/auth.service';

interface Product {
  id: number;
  title: string;
  brand: string;
  images: string[];
  price: number;
  quantity: number;
}

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
  faPlusCircle = faPlusCircle
  isMenuOpen: boolean = false;
  cart: Product[] = [];
  addedProductDetails: any = null;
  produtosCarregados: boolean = false;
  loading: boolean = false;
  noProductsFound: boolean = false;

  constructor(private router: Router, private snackBar: MatSnackBar, private authService: AuthService) { }




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
        this.produtosCarregados = true;
        this.loading = false;
        this.checkNoProductsFound();
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        this.loading = false;
      });
  }

  checkNoProductsFound() {
    this.noProductsFound = this.filteredProducts.length === 0;
  }

  extractCategories(products: any[]) {
    this.categories = Array.from(new Set(products.map(product => product.category)));
  }

  showCart: boolean = false;

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

    if (!this.authService.isLoggedIn()) {
      alert('Você precisa estar logado para excluir produtos.');
      return;
    }

    fetch(`https://dummyjson.com/products/${productId}`, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(deletedProduct => {
        if (deletedProduct.isDeleted && deletedProduct.deletedOn) {
          this.filteredProducts = this.filteredProducts.filter((product: any) => product.id !== productId);
          this.snackBar.open(`Produto ${productId} deletado com sucesso`, 'Fechar', {
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

  addToCart(event: Event, productId: number) {
    event.stopPropagation();

    if (!this.authService.isLoggedIn()) {
      alert('Você precisa estar logado para adicionar produtos ao carrinho.');
      return;
    }

    const existingProductIndex = this.cart.findIndex(product => product.id === productId);
    if (existingProductIndex !== -1) {
      this.cart[existingProductIndex].quantity++;
    } else {
      fetch('https://dummyjson.com/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId })
      })
        .then(res => res.json())
        .then(newProduct => {
          fetch(`https://dummyjson.com/products/${productId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          })
            .then(res => res.json())
            .then(productDetails => {
              const productWithQuantity = { ...productDetails, quantity: 1 };
              this.cart.push(productWithQuantity);
              this.isMenuOpen = true;
            })
            .catch(error => {
              console.error('Error fetching product details:', error);
            });
        })
        .catch(error => {
          console.error('Error adding product to cart:', error);
        });
    }
  }

  removeFromCart(productId: number) {
    const index = this.cart.findIndex(product => product.id === productId);
    if (index !== -1) {
      const product = this.cart[index];
      if (product.quantity > 1) {
        product.quantity--;
      } else {
        this.cart.splice(index, 1);
      }
    }
  }
  increaseQuantity(productId: number) {
    const product = this.cart.find(p => p.id === productId);
    if (product) {
      product.quantity++;
    }
  }

  decreaseQuantity(productId: number) {
    const product = this.cart.find(p => p.id === productId);
    if (product && product.quantity > 1) {
      product.quantity--;
    }
  }
  openSnackBar(message: string) {
    const config = new MatSnackBarConfig();
    config.duration = 3000;
    config.panelClass = ['custom-snackbar'];
    this.snackBar.open(message, 'Fechar', config);
  }


  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}