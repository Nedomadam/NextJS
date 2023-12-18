import { Menubar } from 'primereact/menubar';
import { InputSwitch } from 'primereact/inputswitch';
import { PrimeReactContext } from 'primereact/api';
import { useContext, useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Items } from '@prisma/client';
import React from 'react';

const toast = useRef<Toast>(null);
const dt = useRef<DataTable<Items[]>>(null);
const [items, setItems] = useState();

const [loading, setLoading] = useState(true);

useEffect(() => {
    fetch('/api/items')
        .then((response) => response.json())
        .then((data) => {
            setItems(data)
            setLoading(false);
            if (data.message) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
            }
        });
}, []);

const actionBodyTemplate = (rowData: Items) => {
    return (
        <React.Fragment>
            <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() =>console.log("Tady")} />
        </React.Fragment>
    );
  };


const leftToolbarTemplate = () => {
    return (
        <div className="flex flex-wrap gap-2">
            <Button label="New" icon="pi pi-plus" severity="success" onClick={e => console.log("Tohle je něco jineho")} />
        </div>
    );
};

export default function InputForm() {
    <div className="card">
        {loading ? (
            <div className="flex justify-content-center flex-wrap">
                <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
            </div>
        ) : (
            <div>
                <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                <DataTable ref={dt} value={items}
                    dataKey="id" paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} devices">
                    <Column field="serial_number" header="Serial Number" sortable></Column>
                    <Column field="product_id" header="Product ID" sortable></Column>
                    <Column field="createdAt" header="Created" sortable></Column>
                    <Column body={actionBodyTemplate} exportable={false}></Column>
                </DataTable>
            </div>
        )}
    </div>
}
