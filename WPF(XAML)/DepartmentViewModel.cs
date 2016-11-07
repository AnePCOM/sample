using System.Windows.Input;
using System.Collections.ObjectModel;
using GalaSoft.MvvmLight;
using GalaSoft.MvvmLight.Messaging;
using StavBook.DataAccess;
using StavBook.Model;

using GalaSoft.MvvmLight.Command;


namespace StavBook.ViewModel
{
    public class DepartmentViewModel : ViewModelBase
    {
private readonly ICommand _bookDataComand;

        public ICommand ShowAddDepartmentCommand { get; private set; }
        public ICommand ShowEditDepartmentCommand { get; private set; }
        public ICommand ShowRemoveDepartmentCommand { get; private set; }



        public DepartmentViewModel()
        {
            //DepartmentRepository departmentRepository = new DepartmentRepository();
            _departmentList = DepartmentRepository.GetDepartments();
            _bookDataComand = new RelayCommand(FillGrid);

            ShowAddDepartmentCommand = new RelayCommand(ShowAddDepartment);
            ShowEditDepartmentCommand = new RelayCommand(ShowEditDepartment);
            ShowRemoveDepartmentCommand = new RelayCommand(RemoveDepartment);


        }

        private void ShowAddDepartment()
        {
            var departmentDetailsViewModel = new DepartmentDetailsViewModel(null);
            var message = new GenericMessageWithCallback<DepartmentDetailsViewModel>(departmentDetailsViewModel, FillGrid);
            Messenger.Default.Send(message);
        }

        private void ShowEditDepartment()
        {
            var departmentDetailsViewModel = new DepartmentDetailsViewModel(_selectedItems);
            var message = new GenericMessageWithCallback<DepartmentDetailsViewModel>(departmentDetailsViewModel, FillGrid);
            Messenger.Default.Send(message);
        }

        private void RemoveDepartment()
        {
            
        }

        private void FillGrid()
        {
            _departmentList = DepartmentRepository.GetDepartments();
            RaisePropertyChanged("DepartmentList");
        }

        private ObservableCollection<Department> _departmentList;
        public ObservableCollection<Department> DepartmentList
        {
            get { return _departmentList; }
        }


        private Department _selectedItems;
        public Department SelectedItem
        {
            set {
                 if (_selectedItems == value) return;
                 _selectedItems = value;
                 RaisePropertyChanged("SelectedItem");
            }
        }
       
    }


}
