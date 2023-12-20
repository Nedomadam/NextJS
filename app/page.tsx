"use client";
import { classNames } from 'primereact/utils';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable, DataTableSelectionMultipleChangeEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { ProgressSpinner } from 'primereact/progressspinner';
import Navbar from './components/Navbar';
import Item from './models/Item';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { MultiSelect } from 'primereact/multiselect';


export default function Home() {
  let emptyItem: Item = {
    id: -1,
    name: "",
    count: 0,
    unit: "",
    done: false,
    createdAt: null
  };

  const [items, setItems] = useState<Item[]>([]); //DONE
  const [itemDialog, setItemDialog] = useState<boolean>(false);
  const [deleteItemDialog, setDeleteItemDialog] = useState<boolean>(false);
  const [item, setItem] = useState<Item>(emptyItem);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const dt = useRef<DataTable<Item[]>>(null);
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(true);
  const [deleteItemsDialog, setDeleteItemsDialog] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/item')
      .then((response) => response.json())
      .then((data) => {
        setItems(data)
        setLoading(false);
        if (data.message) {
          toast.current?.show({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
        }
      });
  }, []);

  const confirmDeleteItem = (item: Item) => {
    setItem(item);
    setDeleteItemDialog(true);
  };

  const deleteItem = () => {
    setLoading(true)
    var status = 200
    fetch(`/api/item`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: item.id })
    })
      .then((response) => {
        status = response.status
        return response.json()
      })
      .then((deletedItem) => {
        setItems(items.filter((item) => item.id !== deletedItem.id));
        fetch('/api/item')
          .then((response) => {
            status = response.status
            return response.json()
          })
          .then((data) => {
            setItems(data)
            setLoading(false);
            if (data.message) {
              toast.current?.show({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
            }
          });
        hideDeleteItemDialog()
        if (status != 200) {
          toast.current?.show({ severity: 'error', summary: 'Error', detail: deletedItem.message, life: 3000 });
        }
        else {
          toast.current?.show({ severity: 'success', summary: 'Successful', detail: deletedItem.message, life: 3000 });
        }
      });
  };

  const deleteItems = () => {
    setLoading(true);
    var status = 200;
    let _items = items.filter((val) => selectedItems.includes(val))
    
    let ids = _items.map(item => item.id)
    //console.log([ids])
    fetch(`/api/items`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: ids }),
    })
      .then((response) => {
        status = response.status;
        return response.json();
      })
      .then((deletedItem) => {
        setItems(items.filter((item) => item.id !== deletedItem.id));
        fetch('/api/items')
          .then((response) => {
            status = response.status
            return response.json()
          })
          .then((data) => {
            setItems(data)
            setLoading(false);
            if (data.message) {
              toast.current?.show({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
            }
          });
        hideDeleteItemsDialog()
        if (status != 200) {
          toast.current?.show({ severity: 'error', summary: 'Error', detail: deletedItem.message, life: 3000 });
        }
        else {
          toast.current?.show({ severity: 'success', summary: 'Successful', detail: deletedItem.message, life: 3000 });
        }
      });
  };

  const hideDeleteItemDialog = () => {
    setDeleteItemDialog(false);
  };


  const actionBodyTemplate = (rowData: Item) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteItem(rowData)} />
      </React.Fragment>
    );
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    const val = (e.target && e.target.value) || '';
    let _item = { ...item };

    // @ts-ignore
    _item[`${name}`] = val;

    setItem(_item);
  };

  const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
    const val = (e.target && e.target.value) || '';
    //console.log(e.target.value);
    let _item = { ...item };

    // @ts-ignore
    _item[`${name}`] = val;

    setItem(_item);
  }

  const deleteItemDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteItemDialog} />
      <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteItem} />
    </React.Fragment>
  );

  const openNew = () => {
    setItem(emptyItem);
    setSubmitted(false);
    setItemDialog(true);
  };

  const saveItem = () => {
    setSubmitted(true);
    setLoading(true)
    //console.log(JSON.stringify({ name: item.name, count: item.count, unit: item.unit, done: item.done}))
    fetch('/api/item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: item.name, count: item.count, unit: item.unit, done: item.done }),
    })
      .then((response) => response.json())
      .then((createdItem) => {
        setItems([...items, createdItem]);
        setItem({ id: -1, name: '', count: 0, unit: "", done: false, createdAt: null });
        fetch('/api/item')
          .then((response) => response.json())
          .then((data) => {
            setItems(data)
            setLoading(false);
            if (data.message) {
              toast.current?.show({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
            }
          });
        hideDialog()
        if (createdItem.id) {
          toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Item Created: ' + createdItem.id, life: 3000 });
        }
        else {
          toast.current?.show({ severity: 'error', summary: 'Error', detail: createdItem.message, life: 3000 });
        }
      });
  };

  const hideDialog = () => {
    setSubmitted(false);
    setItemDialog(false);
  };

  const confirmDeleteSelected = () => {
    setDeleteItemsDialog(true);
  };

  const hideDeleteItemsDialog = () => {
    setDeleteItemsDialog(false);
};

const deleteSelectedItems = () => {
  let _items = items.filter((val) => !selectedItems.includes(val));

  setItems(_items);
  setDeleteItemsDialog(false);
  setSelectedItems([]);
  toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Items Deleted', life: 3000 });
};


  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
        <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedItems || !selectedItems.length} />
      </div>
    );
  };

  const deleteItemsDialogFooter = (
    <React.Fragment>
        <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteItemsDialog} />
        <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteItems} />
    </React.Fragment>
);

  const itemDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" onClick={saveItem} />
    </React.Fragment>
  );

  const [selectedItems, setSelectedItems] = useState<Item[] | null>(null);
  const [rowClick, setRowClick] = useState<boolean>(true);

  return (
    <>
      <Navbar />
      <div className="m-3">
        <div className="row">
          <div className="flex-auto w-full">
            <h1>Items</h1>
            <Toast ref={toast} />
            <div className="card">
              {loading ? (
                <div className="flex justify-content-center flex-wrap">
                  <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                </div>
              ) : (
                <div>
                  <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                  <DataTable ref={dt} value={items}
                    dataKey="id" paginator rows={5} rowsPerPageOptions={[5, 10, 25]} selectionMode={'multiple'}
                    selection={selectedItems}
                    onSelectionChange={(e) => {
                      if (Array.isArray(e.value)) {
                          setSelectedItems(e.value);
                      }
                  }}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} items">
                    <Column exportable={false} selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="name" header="Name" sortable></Column>
                    <Column field="count" header="Count" sortable></Column>
                    <Column field="unit" header="Units" sortable></Column>
                    <Column field="createdAt" header="Created" sortable></Column>
                    <Column body={actionBodyTemplate} exportable={false}></Column>
                  </DataTable>
                </div>
              )}
            </div>
            <Dialog visible={itemDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Items Details" modal className="p-fluid" footer={itemDialogFooter} onHide={hideDialog}>
              <div className="field">
                <label htmlFor="serial_number" className="font-bold">
                  Name of item
                </label>
                <InputText id="serial_number" value={item.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !item.id })} />
                {submitted && !item.id && <small className="p-error">Name is required.</small>}
              </div>
              <div className="field">
                <label htmlFor="product_id" className="font-bold">
                  Count
                </label>
                <InputNumber id="product_id" value={item.count} onValueChange={(e) => onInputNumberChange(e, 'count')} required className={classNames({ 'p-invalid': submitted && !item.id })} />
                {submitted && !item.id && <small className="p-error">Product ID is required.</small>}
              </div>
              <div className="field">
                <label htmlFor="serial_number" className="font-bold">
                  Units
                </label>
                <InputText id="serial_number" value={item.unit} onChange={(e) => onInputChange(e, 'unit')} required autoFocus className={classNames({ 'p-invalid': submitted && !item.id })} />
                {submitted && !item.id && <small className="p-error">Name is required.</small>}
              </div>
            </Dialog>
            <Dialog visible={deleteItemDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteItemDialogFooter} onHide={hideDeleteItemDialog}>
              <div className="confirmation-content">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                {item && (
                  <span>
                    Are you sure you want to delete <b>{item.name}</b>?
                  </span>
                )}
              </div>
            </Dialog>
            <Dialog visible={deleteItemsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteItemsDialogFooter} onHide={hideDeleteItemsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {items && <span>Are you sure you want to delete the selected items?</span>}
                </div>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  )
}
