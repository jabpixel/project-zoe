import React from 'react';
import * as yup from 'yup';
import { FormikHelpers } from 'formik';
import Grid from '@material-ui/core/Grid';
import { useDispatch } from 'react-redux';
import { reqDate, reqString } from '../../../../data/validations';
import { idCategories } from '../../../../data/comboCategories';
import XForm from '../../../../components/forms/XForm';
import XTextInput from '../../../../components/inputs/XTextInput';
import XDateInput from '../../../../components/inputs/XDateInput';
import XSelectInput from '../../../../components/inputs/XSelectInput';
import { toOptions } from '../../../../components/inputs/sutils';
import XCheckBoxInput from '../../../../components/inputs/XCheckBoxInput';
import { IIdentification } from '../../types';
import { remoteRoutes } from '../../../../data/constants';
import { crmConstants } from '../../../../data/contacts/reducer';
import { handleSubmission, ISubmission } from '../../../../utils/formHelpers';
import { useDelete } from '../../../../data/hooks/useDelete';

interface IProps {
  contactId: string;
  data: IIdentification | null;
  isNew: boolean;
  done?: () => any;
}

const schema = yup.object().shape({
  category: reqString.oneOf(idCategories),
  value: reqString,
  issuingCountry: reqString,
  startDate: reqDate,
  expiryDate: reqDate,
});

const IdentificationEditor = ({ data, isNew, contactId, done }: IProps) => {
  const dispatch = useDispatch();

  function handleSubmit(values: any, actions: FormikHelpers<any>) {
    const submission: ISubmission = {
      url: remoteRoutes.contactsIdentification,
      values: { ...values, contactId },
      actions,
      isNew,
      onAjaxComplete: (data: any) => {
        dispatch({
          type: isNew
            ? crmConstants.crmAddIdentification
            : crmConstants.crmEditIdentification,
          payload: { ...data },
        });
        if (done) done();
      },
    };
    handleSubmission(submission);
  }

  const deleteActions = useDelete({
    url: `${remoteRoutes.contactsIdentification}/${data?.id}`,
    onDone: done,
    id: data?.id!,
    action: crmConstants.crmDeleteIdentification,
  });

  return (
    <XForm
      onSubmit={handleSubmit}
      schema={schema}
      initialValues={data}
      onCancel={done}
      loading={deleteActions.loading}
      onDelete={deleteActions.handleDelete}
    >
      <Grid spacing={1} container>
        <Grid item xs={12}>
          <XSelectInput
            name="category"
            label="Category"
            options={toOptions(idCategories)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <XTextInput
            name="value"
            label="Id Number"
            type="text"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <XTextInput
            name="issuingCountry"
            label="Issuing Country"
            type="text"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6}>
          <XDateInput name="startDate" label="Issue Date" variant="outlined" />
        </Grid>
        <Grid item xs={6}>
          <XDateInput
            name="expiryDate"
            label="Expiry Date"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <XCheckBoxInput name="isPrimary" label="Primary/Default" />
        </Grid>
      </Grid>
    </XForm>
  );
};

export default IdentificationEditor;
