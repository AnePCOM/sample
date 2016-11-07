using System;
using System.Collections.ObjectModel;
using System.Windows.Input;
using GalaSoft.MvvmLight;
using GalaSoft.MvvmLight.Command;
using StavBook.DataAccess;
using StavBook.Helpers;
using StavBook.Model;


namespace StavBook.ViewModel
{
    public class EquipmentDetailsViewModel : ViewModelBase
    {

        private readonly ICommand _equipmentDataComand;
        public ICommand SaveMolCommand { get; private set; }

        public event EventHandler SaveAndClose;


        private int _id;
        private string _name;
        private Nullable<int> _idMol;
        private Nullable<int> _idBook;
        private string _serialNumber;
        private string _inventoryNumber;
        private Nullable<int> _quantity;
        private Nullable<int> _idUnit;
        private Nullable<decimal> _price;
        private Nullable<System.DateTime> _dateInput;
        private Nullable<int> _gold;
        private Nullable<int> _silver;
        private Nullable<int> _palladium;
        private Nullable<int> _platinum;
        private string _mPG;
        private string _caption;

        public int Id
        {
            get { return _id; }
            set
            {
                _id = value;
                RaisePropertyChanged("Id");
            }
        }
        public string Name
        {
            get { return _name; }
            set
            {
                _name = value;
                RaisePropertyChanged("Name");
            }
        }
        public int? IdMol
        {
            get { return _idMol; }
            set
            {
                _idMol = value;
                RaisePropertyChanged("IdMol");
            }
        }
        public Nullable<int> IdBook
        {
            get { return _idBook; }
            set
            {
                _idBook = value;
                RaisePropertyChanged("IdBook");
            }
        }
        public string SerialNumber
        {
            get { return _serialNumber; }
            set
            {
                _serialNumber = value;
                RaisePropertyChanged("SerialNumber");
            }
        }
        public string InventoryNumber
        {
            get { return _inventoryNumber; }
            set
            {
                _inventoryNumber = value;
                RaisePropertyChanged("InventoryNumber");
            }
        }
        public Nullable<int> Quantity
        {
            get { return _quantity; }
            set
            {
                _quantity = value;
                RaisePropertyChanged("Quantity");
            }
        }
        public Nullable<int> IdUnit
        {
            get { return _idUnit; }
            set
            {
                _idUnit = value;
                RaisePropertyChanged("IdUnit");
            }
        }
        public Nullable<decimal> Price
        {
            get { return _price; }
            set
            {
                _price = value;
                RaisePropertyChanged("Price");
            }
        }
        public Nullable<System.DateTime> DateInput
        {
            get { return _dateInput; }
            set
            {
                _dateInput = value;
                RaisePropertyChanged("DateInput");
            }
        }
        public Nullable<int> Gold
        {
            get { return _gold; }
            set
            {
                _gold = value;
                RaisePropertyChanged("Gold");
            }
        }
        public Nullable<int> Silver
        {
            get { return _silver; }
            set
            {
                _silver = value;
                RaisePropertyChanged("Silver");
            }
        }
        public Nullable<int> Palladium
        {
            get { return _palladium; }
            set
            {
                _palladium = value;
                RaisePropertyChanged("Palladium");
            }
        }
        public Nullable<int> Platinum
        {
            get { return _platinum; }
            set
            {
                _platinum = value;
                RaisePropertyChanged("Platinum");
            }
        }
        public string MPG
        {
            get { return _mPG; }
            set
            {
                _mPG = value;
                RaisePropertyChanged("MPG");
            }
        }
        public string Caption
        {
            get { return _caption; }
            set
            {
                _caption = value;
                RaisePropertyChanged("Caption");
            }
        }



        private Mol _selectedMolsTransmit;
        public Mol SelectedMolsTransmit
        {
            get
            {
                return this._selectedMolsTransmit;
            }
            set
            {
                if (this._selectedMolsTransmit == value) return;
                this._selectedMolsTransmit = value;
                RaisePropertyChanged("SelectedMolsTransmit");
            }
        }

        private Mol _selectedMol;
        public Mol SelectedMol
        {
            get
            {
                return this._selectedMol;
            }
            set
            {
                if (this._selectedMol == value) return;
                this._selectedMol = value;
                RaisePropertyChanged("SelectedMol");
            }
        }
        
        private Book _selectedBook;
        public Book SelectedBook
        {
            get
            {
                return this._selectedBook;
            }
            set
            {
                if (this._selectedBook == value) return;
                this._selectedBook = value;
                RaisePropertyChanged("SelectedBook");
            }
        }

        private Unit _selectedUnit;
        public Unit SelectedUnit
        {
            get
            {
                return this._selectedUnit;
            }
            set
            {
                if (this._selectedUnit == value) return;
                this._selectedUnit = value;
                RaisePropertyChanged("SelectedUnit");
            }
        }


        private Nullable<DateTime> _transmitDateOperations;
        public Nullable<DateTime> TransmitDateOperations
        {
            get
            {
                return _transmitDateOperations;
            }
            set
            {
                if (this._transmitDateOperations == value) return;
                this._transmitDateOperations = value;
                RaisePropertyChanged("TransmitDateOperations");
            }
        }

        private string _transmitDocumentNumber;
        public string TransmitDocumentNumber
        {
            get
            {
                return _transmitDocumentNumber;
            }
            set
            {
                if (this._transmitDocumentNumber == value) return;
                this._transmitDocumentNumber = value;
                RaisePropertyChanged("TransmitDocumentNumber");
            }
        }


        private int _transmitQuantity;
        public int TransmitQuantity
        {
            get
            {
                return _transmitQuantity;
            }
            set
            {
                if (this._transmitQuantity == value) return;
                this._transmitQuantity = value;
                RaisePropertyChanged("TransmitQuantity");
            }
        }
        
       

        #region TypeOperations
        private TypeOperation _selectedTransmitTypeOperation;
        public TypeOperation SelectedTransmitTypeOperation
        {
            get
            {
                return this._selectedTransmitTypeOperation;
            }
            set
            {
                if (this._selectedTransmitTypeOperation == value) return;
                this._selectedTransmitTypeOperation = value;
                RaisePropertyChanged("SelectedTransmitTypeOperation");
            }
        }
        private ObservableCollection<TypeOperation> _transmitTypeOperations;
        public ObservableCollection<TypeOperation> TransmitTypeOperations
        {
            get
            {
                return this._transmitTypeOperations;
            }
            set
            {

                this._transmitTypeOperations = value;
                RaisePropertyChanged("TransmitTypeOperations");
            }
        }
        #endregion
       
        
        
        private ObservableCollection<Mol> _mols;
        public ObservableCollection<Mol> Mols
        {
            get
            {
                return this._mols;
            }
            set
            {

                this._mols = value;
                RaisePropertyChanged("Mols");
            }
        }

        private ObservableCollection<Book> _book;
        public ObservableCollection<Book> Books
        {
            get
            {
                return this._book;
            }
        }

        private ObservableCollection<Unit> _units;
        public ObservableCollection<Unit> Units
        {
            get
            {
                return this._units;
            }
        }

        

        private Equipment _equipment;

        public Equipment Equipment
        {
            get
            {
                return this._equipment;
            }
            set
            {
                if (this._equipment == value) return;
                this._equipment = value;
                RaisePropertyChanged("Equipment");
            }
        }

        private ObservableCollection<Unit> _unit;
        public ObservableCollection<Unit> Unit
        {
            get
            {
                return this._unit;
            }
        }

        public EquipmentDetailsViewModel(Equipment equipment)
        {
            _equipment = equipment ?? new Equipment();
            Mols = new MolRepository().GetMols();
            _book = new BookRepository().GetBooks();
            _units = new UnitRepository().GetUnits();
            TransmitTypeOperations = new TypeOperationsRepository().GetTypeOperations();
            SaveEquipmentCommand = new RelayCommand(SaveEquipment);
            SelectedMolsTransmitCommand = new RelayCommand(SelectedMolsTransmitSave);
        }

        private void SaveMol()
        {
            EquipmentRepository molRepository = new EquipmentRepository();
           /* molRepository.TryInsertOrUpdate(new Equipment() {   Id = _id, 
                                                                Name = _name, 
                                                                IdMol = _idMol,  
                                                                IdBook = _idBook, 
                                                                SerialNumber = _serialNumber, 
                                                                InventoryNumber = _inventoryNumber, 
                                                                Quantity = _quantity , 
                                                                IdUnit = _idUnit, 
                                                                Price = _price, 
                                                                DateInput = _dateInput, 
                                                                Gold = _gold , 
                                                                Silver = _silver , 
                                                                Palladium = _palladium, 
                                                                Platinum = _platinum, 
                                                                MPG = _mPG , 
                                                                Caption = _caption });*/
            SaveAndCloseMethod();

        }



         private void SaveEquipment()
        {
             EquipmentRepository equipmentRepository = new EquipmentRepository();
             equipmentRepository.TryInsertOrUpdate(_equipment);

            SaveAndCloseMethod();
        }

        public ICommand SaveEquipmentCommand { get; private set; }


        public ICommand SelectedMolsTransmitCommand { get; private set; }

        private void SelectedMolsTransmitSave()
        {
            EquipmentRepository equipmentRepository = new EquipmentRepository();
            equipmentRepository.MolsTransmitInsertOrUpdate(ref _equipment, new MolTransmited() { DateOperation = _transmitDateOperations, TransmitedTypeOperation = _selectedTransmitTypeOperation, TransmitedMol = SelectedMolsTransmit, DocumentNumber = _transmitDocumentNumber,Quantity = _transmitQuantity });
            SaveAndCloseMethod();
        }


        private void SaveAndCloseMethod()
        {
            var handler = SaveAndClose;
            if (handler != null)
                handler(this, EventArgs.Empty);
        }
    }

    
}
