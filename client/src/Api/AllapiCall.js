


import React from 'react'
import { useDispatch } from 'react-redux';
const adminData = useSelector((state) => state.admin.user);
console.log(adminData);
const AllapiCall = () => {
    const dispatch =useDispatch()
    useEffect(() => {
        // Dispatch the fetchDocuments async thunk when the component mounts
        dispatch(getAllCompaniesDocument({ DOCUMENT_REF_ID:companyData.COMPANY_ID.COMPANY_ID, DOCUMENT_ADMIN_USERNAME: adminData.DOCUMENT_ADMIN_USERNAME }));
      }, [dispatch]);
  return (
    <div>AllapiCall</div>
  )
}

export default AllapiCall