import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-comisiones',
  templateUrl: './comisiones.component.html',
  styleUrls: ['./comisiones.component.css']
})

export class ComisionesComponent implements OnInit{
  comisionFormGroup = this._formBuilder.group({
    ramo: [''],
    agente: [''],
    poliza: [''],
    cobertura: [''],
    fechaValidez: ['']
  });
  ramo: string | null = '';

  constructor(
    private _formBuilder: FormBuilder,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    // public dialog: MatDialog,
    // private route: ActivatedRoute,
    // private cargarService: CargarService,
    // private gestionService: GestionService,
    // public _MatPaginatorIntl: MatPaginatorIntl,
    // private imprimirService: ImprimirService,
    // private router: Router,
    // private datePipe: DatePipe
  ) {}
  ngOnInit(): void {
  
    
  }
}
