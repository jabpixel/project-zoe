import React from 'react';
import * as yup from 'yup';
import { FormikHelpers } from 'formik';
import Grid from '@material-ui/core/Grid';
import { reqString } from '../../../../data/validations';
import XForm from '../../../../components/forms/XForm';

import { remoteRoutes } from '../../../../data/constants';
import { post, put } from '../../../../utils/ajax';
import Toast from '../../../../utils/Toast';
import { GroupRole, IGroup } from '../../../groups/types';
import XSelectInput from '../../../../components/inputs/XSelectInput';
import { toOptions } from '../../../../components/inputs/sutils';
import { enumToArray } from '../../../../utils/stringHelpers';

interface IProps {
  data?: Partial<IGroup>;
  isNew: boolean;
  onGroupAdded?: (g: any) => any;
  onGroupEdited?: (g: any) => any;
}

const schema = yup.object().shape({
  name: reqString,
  description: reqString,
  tag: reqString,
});

const GroupEditor = ({ data, isNew, onGroupAdded, onGroupEdited }: IProps) => {
  function handleSubmit(values: any, actions: FormikHelpers<any>) {
    const toSave: IGroup = {
      categoryId: '',
      id: '0',
      ...data,
      name: values.name,
      details: values.description,
      privacy: values.privacy,
      parent: values.parent,
      children: [],
    };
    if (isNew) {
      post(
        remoteRoutes.groups,
        toSave,
        (data) => {
          Toast.info('Group created');
          actions.resetForm();
          onGroupAdded && onGroupAdded(data);
        },
        undefined,
        () => {
          actions.setSubmitting(false);
        },
      );
    } else {
      put(
        remoteRoutes.groups,
        toSave,
        (data) => {
          Toast.info('Group updated');
          actions.resetForm();
          onGroupEdited && onGroupEdited(data);
        },
        undefined,
        () => {
          actions.setSubmitting(false);
        },
      );
    }
  }

  return (
    <XForm onSubmit={handleSubmit} schema={schema} initialValues={data}>
      <Grid spacing={1} container>
        <Grid item xs={12}>
          <XSelectInput
            name="role"
            label="Role"
            options={toOptions(enumToArray(GroupRole))}
            variant="outlined"
          />
        </Grid>
      </Grid>
    </XForm>
  );
};

export default GroupEditor;
