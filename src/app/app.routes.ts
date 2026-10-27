import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Home } from './layout/home/home';
import { Products } from './layout/products/products';
import { ProductDetails } from './layout/product-details/product-details';
import { Login } from './layout/login/login';
import { Signup } from './layout/signup/signup';
import { Profile } from './layout/profile/profile';
import { Cart } from './layout/cart/cart';
import { Checkout } from './layout/checkout/checkout';                        
import { NotFound } from './shared/not-found/not-found';
import { Dashboard } from './dashboard/dashboard';
import { Home as DashboardHome } from './dashboard/home/home';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
import { deactivateGuard } from './core/guards/deactivate-guard';
import { MyOrders } from './layout/my-orders/my-orders';
import { Orders } from './dashboard/orders/orders';
import { Products as DashboardProducts } from './dashboard/products/products';
import { AddProduct } from './dashboard/add-product/add-product';
import { Notifications } from './dashboard/notifications/notifications';
import { Testimonials } from './dashboard/testimonials/testimonials';
import { EditProduct } from './dashboard/edit-product/edit-product';
import { SalesReport } from './dashboard/sales-report/sales-report';
import { ProductDetailsResolver } from './core/resolvers/product-details.resolver';
export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Home },
      { path: 'products', component: Products },
      { path: 'products/:slug', component: ProductDetails,
      resolve: { productRes:ProductDetailsResolver },},
      { path: 'cart', component: Cart },
      { path: 'checkout', component: Checkout, canActivate: [authGuard] },   
      { path: 'login', component: Login },
      { path: 'signup', component: Signup, canDeactivate: [deactivateGuard] },
      { path: 'profile', component: Profile, canActivate: [authGuard] },
      { path: 'my-orders', component: MyOrders, canActivate: [authGuard] },
    ],
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: DashboardHome },
      { path: 'orders', component: Orders },
      { path: 'products', component: DashboardProducts },
      { path: 'products/add', component: AddProduct },
      { path: 'products/edit/:id', component: EditProduct },
      { path: 'notifications', component: Notifications },
      { path: 'testimonials', component: Testimonials },
      { path: 'report', component: SalesReport },
    ],
  },
  { path: '**', component: NotFound },
];