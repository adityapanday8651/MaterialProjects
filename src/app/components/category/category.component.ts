import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AppservicesService } from 'src/app/services/appservices.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  categoryForm: FormGroup | any;
  public getAllCategories: any[] = [];
  displayedColumns: string[] = ['position', 'name', 'action'];
  dialogRef!: MatDialogRef<any>;
  isEditMode = false;
  selectedCategory: any;

  constructor(
    private appServices: AppservicesService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) { }
  async ngOnInit() {
    this.initializeForm();
   await this.getAllCategoriesAsync();
  }

  initializeForm() {
    this.categoryForm = this.fb.group({
      id: [''],
      name: ['', Validators.required]
    });
  }

  public async getAllCategoriesAsync() {
    await this.appServices.getAllCategoriesAsync().subscribe(response => {
      this.getAllCategories = response.data.categories;
    },
      error => {
        console.error('Error fetching categories:', error);
      }
    )
  }

  public async addCategoryAsync(categoryData: any) {
    await this.appServices.addCategoryAsync(categoryData).subscribe(response => {
      this.categoryForm.reset();
      this.getAllCategoriesAsync();
    },
      error => {
        console.error('Error save categories:', error);
      }
    );
  }
  public async updateCategoryAsync(categoryData: any) {
    await this.appServices.updateCategoryAsync(categoryData.id, categoryData).subscribe((response => {
      this.categoryForm.reset();
      this.getAllCategoriesAsync();
    }))
  }

  openDialog(category?: any): void {
    this.isEditMode = !!category;
    if (this.isEditMode) {
      this.categoryForm.patchValue({
        id: category.id,
        name: category.name
      });
    } else {
      this.categoryForm.reset();
    }
    this.dialogRef = this.dialog.open(this.dialogTemplate, {
      width: '400px'
    });
  }
  async SaveOrUpdate() {
    if (this.categoryForm.valid) {
      const categoryData = this.categoryForm.value;
      if (this.isEditMode) {
        await this.updateCategoryAsync(categoryData);
      } else {
        await this.addCategoryAsync(categoryData);
      }
      this.dialogRef.close();
    }
  }
  onCancel(): void {
    this.dialogRef.close();
  }
  onDelete(id: string): void {
    console.log('Deleting category with ID:', id);
  }
}
