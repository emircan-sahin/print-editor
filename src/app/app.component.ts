import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'PrintEditor';

  paperTypes = ['A3', 'A4', 'A5', 'Özel'];
  selectedPaperType = 'Özel';
  isCustomPaper = true;
  customWidth: number;
  customHeight: number;

  selectedElementType: 'text' | 'image' | null = null;
  selectedText: any = null;

  textForm = {
    x_axis: 0,
    y_axis: 0,
    name: '',
    font: 'Arial',
    fontSize: 12,
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false
  };

  selectedImage: any = null;
  imageForm = {
    x_axis: 0,
    y_axis: 0,
    name: '',
    value: '',
  };

  textInputs: any[] = [];
  imageInputs: any[] = [];

  paperDimensions: { [key: string]: { width: number, height: number } } = {
    'A3': { width: 297, height: 420 },
    'A4': { width: 210, height: 297 },
    'A5': { width: 148, height: 210 },
    'Özel': { width: 300, height: 175 }
  };

  constructor(private http: HttpClient) {
    this.customWidth = this.paperDimensions[this.selectedPaperType].width;
    this.customHeight = this.paperDimensions[this.selectedPaperType].height;
  }

  onPaperTypeChange(event: any) {
    this.isCustomPaper = event.target.value === 'Özel';
    const dimensions = this.paperDimensions[event.target.value];
    this.customWidth = dimensions.width;
    this.customHeight = dimensions.height;
  }

  convertToMM(value: number) {
    return value * 3.78;
  }

  selectElementType(type: 'text' | 'image') {
    this.resetTextForm();
    this.resetImageForm();
    this.selectedElementType = type;
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageForm = {
          x_axis: this.imageForm.x_axis,
          y_axis: this.imageForm.y_axis,
          name: file.name,
          value: e.target?.result as string
        };
        this.updateImage();
      };
      reader.readAsDataURL(file);
    }
  }

  toggleBold() {
    this.textForm.bold = !this.textForm.bold;
    this.updateText();
  }

  toggleItalic() {
    this.textForm.italic = !this.textForm.italic;
    this.updateText();
  }

  toggleUnderline() {
    this.textForm.underline = !this.textForm.underline;
    this.updateText();
  }

  toggleStrikethrough() {
    this.textForm.strikethrough = !this.textForm.strikethrough;
  }

  addText() {
    if (!this.textForm.name.trim()) {
      alert('Alan adı boş olamaz.');
      return;
    }

    const duplicateText = this.textInputs.find(text => text.name === this.textForm.name && text !== this.selectedText);
    const duplicateImage = this.imageInputs.find(image => image.name === this.textForm.name);
    if (duplicateText || duplicateImage) {
      alert('Bu isimde zaten bir öğe var.');
      return;
    }

    const textInput = {
      type: 'text',
      name: this.textForm.name,
      value: this.textForm.name,
      x_axis: this.textForm.x_axis,
      y_axis: this.textForm.y_axis,
      font: this.textForm.font,
      font_size: this.textForm.fontSize,
      bold: this.textForm.bold,
      italic: this.textForm.italic,
      underline: this.textForm.underline,
      strikethrough: this.textForm.strikethrough
    };
    this.textInputs.push(textInput);
    this.selectedText = textInput;
  }

  updateText() {
    if (this.selectedText) {
      if (!this.textForm.name.trim()) {
        alert('Alan adı boş olamaz.');
        return;
      }

      this.selectedText.name = this.textForm.name;
      this.selectedText.x_axis = this.textForm.x_axis;
      this.selectedText.y_axis = this.textForm.y_axis;
      this.selectedText.font = this.textForm.font;
      this.selectedText.font_size = this.textForm.fontSize;
      this.selectedText.bold = this.textForm.bold;
      this.selectedText.italic = this.textForm.italic;
      this.selectedText.underline = this.textForm.underline;
      this.selectedText.strikethrough = this.textForm.strikethrough;
    }
  }

  addImage() {
    if (!this.imageForm.name.trim()) {
      alert('Alan adı boş olamaz.');
      return;
    }

    const duplicateText = this.textInputs.find(text => text.name === this.imageForm.name);
    const duplicateImage = this.imageInputs.find(image => image.name === this.imageForm.name);
    if (duplicateText || duplicateImage) {
      alert('Bu isimde zaten bir öğe var.');
      return;
    }

    const imageInput = {
      type: 'image',
      name: this.imageForm.name,
      value: this.imageForm.value,
      x_axis: this.imageForm.x_axis,
      y_axis: this.imageForm.y_axis
    };

    this.imageInputs.push(imageInput);
    this.selectedImage = imageInput;
  }

  updateImage() {
    if (this.selectedImage) {
      if (!this.imageForm.name.trim()) {
        alert('Alan adı boş olamaz.');
        return;
      }

      const duplicateImage = this.imageInputs.find(image => image.name === this.imageForm.name && image !== this.selectedImage);
      if (duplicateImage) {
        alert('Bu isimde zaten bir öğe var.');
        return;
      }

      this.selectedImage.name = this.imageForm.name;
      this.selectedImage.x_axis = this.imageForm.x_axis;
      this.selectedImage.y_axis = this.imageForm.y_axis;
      this.selectedImage.value = this.imageForm.value;
    }
  }

  onDragStart(event: DragEvent, text: any) {
    this.selectedText = text;
    event.dataTransfer?.setData('text/plain', text.value);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const boundingRect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX - boundingRect.left;
    const y = event.clientY - boundingRect.top;

    const selectedElement = document.querySelector(`[data-id="${this.selectedText.name}"]`);
    const elementRect = selectedElement?.getBoundingClientRect();

    if (this.selectedText && elementRect) {
      const offsetX = (elementRect.width * 25.4) / 96 / 2;
      const offsetY = (elementRect.height * 25.4) / 96 / 2;

      this.selectedText.x_axis = Math.floor(((x * 25.4) / 96) - offsetX);
      this.selectedText.y_axis = Math.floor(((y * 25.4) / 96) - offsetY);

      this.resetTextForm();
    }

    if (this.selectedImage && elementRect) {
      const offsetX = (elementRect.width * 25.4) / 96 / 2;
      const offsetY = (elementRect.height * 25.4) / 96 / 2;

      this.selectedImage.x_axis = Math.floor(((x * 25.4) / 96) - offsetX);
      this.selectedImage.y_axis = Math.floor(((y * 25.4) / 96) - offsetY);

      this.resetImageForm();
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  selectText(text: any, event: MouseEvent) {
    event.stopPropagation();
    this.selectedText = text;
    this.textForm = { ...text };
    this.selectedElementType = 'text';
  }

  selectImage(image: any, event: MouseEvent) {
    event.stopPropagation();
    this.selectedImage = image;
    this.imageForm = { ...image };
    this.selectedElementType = 'image';
  }

  setAlign(align: 'left' | 'center' | 'right') {
    const parentWidth = this.customWidth;

    if (this.selectedText) {
      let itemWidth = document.querySelector(`[data-id="${this.selectedText.name}"]`)?.getBoundingClientRect().width || 0;
      itemWidth = (itemWidth * 25.4) / 96;

      if (align === 'left') {
        this.selectedText.x_axis = 0;
      } else if (align === 'center') {
        this.selectedText.x_axis = Math.floor((parentWidth - itemWidth) / 2);
      } else if (align === 'right') {
        this.selectedText.x_axis = Math.floor(parentWidth - itemWidth);
      }
      this.textForm = { ...this.selectedText };
    } else if (this.selectedImage) {
      let itemWidth = document.querySelector(`[data-id="${this.selectedImage.name}"]`)?.getBoundingClientRect().width || 0;
      itemWidth = (itemWidth * 25.4) / 96;

      if (align === 'left') {
        this.selectedImage.x_axis = 0;
      } else if (align === 'center') {
        this.selectedImage.x_axis = Math.floor((parentWidth - itemWidth) / 2);
      } else if (align === 'right') {
        this.selectedImage.x_axis = Math.floor(parentWidth - itemWidth);
      }
      this.imageForm = { ...this.selectedImage };
    }
  }

  clearSelection(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.tagName.toLowerCase() !== 'div' || target.draggable) {
      return;
    }
    this.resetTextForm();
  }

  resetTextForm() {
    this.textForm = {
      x_axis: 0,
      y_axis: 0,
      name: '',
      font: 'Arial',
      fontSize: 12,
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false
    };
    this.selectedText = null;
    this.selectedElementType = null;
  }

  resetImageForm() {
    this.imageForm = {
      x_axis: 0,
      y_axis: 0,
      name: '',
      value: ''
    };
    this.selectedImage = null;
    this.selectedElementType = null;
  }

  exportToJSON() {
    const text = this.textInputs;
    const image = this.imageInputs;

    const httpUploadOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data'
      })
    };

    const formData = new FormData();
    formData.append('text', JSON.stringify(text));
    formData.append('image', JSON.stringify(image));

    this.http.post('https://pusulaweb.com.tr/api/editor', formData, httpUploadOptions).subscribe((response) => {
      console.log(response);
    });

    console.log({ text, image });
  }
}