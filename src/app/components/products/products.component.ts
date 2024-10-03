import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppservicesService } from 'src/app/services/appservices.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  @ViewChild('productDialogTemplate') productDialogTemplate!: TemplateRef<any>;
  public productForm: FormGroup | any;
  public getAllProducts: any[] = [];
  public lstAllCategories: any[] = [];
  public productsColumns: string[] = ['position', 'name', 'categoryName', 'price', 'action'];
  dialogRef!: MatDialogRef<any>;
  isEditMode = false;
  selectedCategory: any;
  constructor(
    private appServices: AppservicesService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }
  async ngOnInit() {
    this.initializeReactiveForm();
    await this.getAllProductsAsync();
    await this.getAllCategoriesAsync();
  }
  public async getAllProductsAsync() {
    await this.appServices.getAllProductsAsync().subscribe(response => {
      this.getAllProducts = response.data;
    },
      error => {
        console.error('Error fetching categories:', error);
      }
    )
  }
  public initializeReactiveForm() {
    this.productForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: [, [Validators.required, Validators.min(0.01)]],
      categoryId: ['', Validators.required],
      categoryName: ['']
    });

  }
  openDialog(product?: any): void {
    this.isEditMode = !!product;
    if (this.isEditMode) {
      this.patchValueForUpdateModelAsync(product);
    } else {
      this.productForm.reset();
    }
    this.dialogRef = this.dialog.open(this.productDialogTemplate, {
      width: '400px'
    });
  }
  async SaveOrUpdate() {
    if (this.productForm.valid) {
      const productDataModel = this.productForm.value;
      if (this.isEditMode) {
        await this.updateProductAsync(productDataModel);
      } else {
        await this.addProductAsync(productDataModel);
      }
      this.dialogRef.close();
    }
  }
  public async getAllCategoriesAsync() {
    await this.appServices.getAllCategoriesAsync().subscribe(response => {
      this.lstAllCategories = response.data.categories;
    },
      error => {
        console.error('Error fetching categories:', error);
      }
    )
  }
  public async addProductAsync(productDataModel:any) {
      await this.appServices.addProductAsync(productDataModel).subscribe(response => {
      },
        error => {
          console.error('Error save addProductAsync:', error);
        }
      );
  }
  public async updateProductAsync(productDataModel:any) {
    await this.appServices.updateProductAsync(productDataModel.id, productDataModel).subscribe((response => {
        this.getAllProductsAsync();
       this.openSnackBar(response.message, 'Close');
    }))
  }
  public async patchValueForUpdateModelAsync(response: any) {
    this.productForm.patchValue({
      id: response.id,
      name: response.name,
      price: response.price,
      categoryId: response.categoryId,
      categoryName: response.categoryName,
    });
  }
  onCancel(): void {
    this.dialogRef.close();
  }
  onDelete(id: string): void {
    console.log('Deleting category with ID:', id);
  }
   private openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
