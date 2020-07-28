import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ElementoLista } from 'src/app/modelos/elementoLista.model';
import { ToastrService } from 'ngx-toastr';
import { ConectorApi } from 'src/app/servicios/conectorApi.service';
import { ApiRest } from 'src/app/modelos/apiResponse.model';
import { Carrito } from 'src/app/servicios/carrito.service';
import { Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var require
const Swal = require('sweetalert2')

@Component({
  selector: 'app-finalizar-pedido',
  templateUrl: './finalizar-pedido.component.html',
  styleUrls: ['./finalizar-pedido.component.scss']
})
export class FinalizarPedidoComponent implements OnInit {
  direcciones:any[];
  itemDireccion:any={};
  tipoPagoSeleccionado=0;
  nuevoTipoPago=0;
  departamentos: ElementoLista[] = [];
  municipios: ElementoLista[] = [];
  tiposPago:any[]=[];
  detallePedido:any[]=[];
  public cartItems: Observable<any[]> = of([]);
  public checkOutItems: any;
  public amount: number;
  public submitted = false;
  public userInfo: string;
  modalReference: NgbModalRef;
  constructor(private router: Router,private fb: FormBuilder,private conectorApi: ConectorApi, private toastrService: ToastrService,private carrito:Carrito, private modalService: NgbModal) {
    this.listarMisDirecciones();
  }

  public seleccionarDireccion(item){
    this.itemDireccion=item;
  }

  public cambiarTipoPago(idtipo){
    this.nuevoTipoPago=idtipo;
  }

  public abrirModal(content) {
    this.modalReference = this.modalService.open(content);
  }
  public cerrarModal(event) {
    this.modalReference.close();
    this.listarMisDirecciones();
  }
  
  /*
  async onSubmit() {
    this.detallePedido=[];
    let dataPedido;
    this.submitted = true;
    // if (this.checkoutForm.invalid) {
    //   return;
    // }
    this.userInfo = this.checkoutForm.value;
    //console.log("Info formulario",this.userInfo);
    //console.log("info",this.checkOutItems);
    this.checkOutItems.forEach(item=>{
     let itemPedido={
        id:item.producto.id,
        idTalla:item.talla.idTalla,
        idColor:item.color.idColor,
        cantidad:item.cantidad
      }
      this.detallePedido.push(itemPedido);
    })

let json={
  data:this.userInfo,
  detallePedido:this.detallePedido,
  idTipoPago:this.tipoPagoSeleccionado
}



  await  this.conectorApi.Post("pedido/recibe/registro", json).subscribe(
      (data)=>{
        let dat = data as ApiRest;
        if(dat.codigo==0){
          const {idPedido}=dat.data;
          Swal.fire({
            title: 'Informacion?',
            text: "Pedido generado exitosamente",
            type: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
          }).then((result) => {
            this.router.navigate(['/comercio/detallepedido/'+idPedido]);  
          });
        }else{
          this.toastrService.error(dat.error, 'Alerta!');
        }
      },
      (dataErrror)=>{
        this.toastrService.error(dataErrror.error, 'Alerta!');
      }
    )
  }
  */
  public getTotal(): Observable<number> {
    return this.carrito.getCantidadTotal();
  }
  ngOnInit() {
    this.cartItems = this.carrito.getTodos();
    this.cartItems.subscribe(products => this.checkOutItems = products);
    this.carrito.getCantidadTotal().subscribe(amount => this.amount = amount);
    this.listarTipoPago();
  }
  
  async listarTipoPago() {
    try {
      this.tiposPago=[];
      this.conectorApi.Get('tipopago/listar').subscribe(
        (data) => {
          let dat = data as ApiRest;
          if(dat.codigo==0){
            this.tiposPago=dat.data;
            if(this.tiposPago.length==1){
              this.tipoPagoSeleccionado=1;
            }
          }
        },
        (dataError) => {
          this.toastrService.error(dataError.error, 'Alerta!');
        }
      )
    } catch (ex) {
      this.toastrService.error(ex, 'Alerta!');
    }
  }

  listarMisDirecciones() {
    try {
      this.conectorApi.Get('usuario/misdirecciones').subscribe(
        (data) => {
          let dat = data as ApiRest;
          this.direcciones = dat.data;
          this.itemDireccion=this.direcciones[0];
        },
        (dataError) => {
          this.toastrService.error(dataError.error.error.message, 'Alerta!');
        }
      )
    } catch (ex) {
      this.toastrService.error(ex.message, 'Alerta!');
    }

  }




}
