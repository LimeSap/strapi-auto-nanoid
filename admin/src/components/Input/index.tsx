// import { Field, FieldAction, FieldError, FieldHint, FieldInput, FieldLabel } from '@strapi/design-system/Field'
// import { Flex } from '@strapi/design-system/Flex'
// import { Stack } from '@strapi/design-system/Stack'
// import Refresh from '@strapi/icons/Refresh'
import React, { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { Refresh } from "@strapi/icons"
import {
  Box,
  Field,
  FieldAction,
  FieldError,
  FieldHint,
  FieldInput,
  FieldLabel,
  Icon,
  Stack,
  Flex,
} from '@strapi/design-system';
import {nanoid} from "nanoid";


export const FieldActionWrapper = styled(FieldAction)`
  svg {
    height: 1rem;
    width: 1rem;
    path {
      fill: ${({ theme }) => theme.colors.neutral400};
    }
  }

  svg:hover {
    path {
      fill: ${({ theme }) => theme.colors.primary600};
    }
  }
`

const Input = ({
  description,
  placeholder,
  disabled,
  error,
  intlLabel,
  labelAction,
  name,
  onChange,
  value: initialValue = "",
  attribute,
  ...props
}: {
  description: any
  placeholder: string
  disabled: boolean
  error: boolean
  intlLabel: any
  labelAction: string
  name: string
  onChange(v: any): void
  value: string,
  attribute: {
    customField: string,
    options: {
      idLength: number | null,
    }
  },
}) => {
  const { formatMessage } = useIntl()
  const [invalidNanoID, setInvalidNanoID] = useState<boolean>(false)
  const ref = useRef("")

  const idLength = attribute?.options?.idLength ?? 21;
  const validationRegExp = new RegExp("^[\\w_-]{" + idLength + "}$");
  const validate = (proposedId) => {
    return validationRegExp.test(proposedId)
  }

  useEffect(() => {
    if(!initialValue) {
      const newNanoID = nanoid(idLength)
      onChange({ target: { value: newNanoID, name }})
    }

    if(initialValue && initialValue !== ref.current)
      ref.current = initialValue

    const validateValue = validate(initialValue)
    if(!validateValue) return setInvalidNanoID(true)
    setInvalidNanoID(false)
  }, [initialValue])

  return (
    <Box>
      <Field
        id={name}
        name={name}
        hint={description && formatMessage(description)}
        error={error ?? (
          invalidNanoID
            ? formatMessage({
                id: 'nanoid.form.field.error',
                defaultMessage: 'The NanoID format is invalid.',
              })
            : null
          )
        }
      >
        <Stack spacing={1}>
          <Flex>
            <FieldLabel>{formatMessage(intlLabel)}</FieldLabel>
          </Flex>
          <FieldInput
            onChange={onChange}
            labelAction={labelAction}
            placeholder={placeholder}
            disabled={disabled}
            required
            value={initialValue}
            ref={ref}
            readOnly
            endAction={
              <FieldActionWrapper
                onClick={() => {
                  const newNanoID = nanoid(idLength)
                  onChange({ target: { value: newNanoID, name }})
                }}
                label={formatMessage({
                  id: 'nanoid.form.field.generate',
                  defaultMessage: 'Generate',
                })}
              >
                <Refresh />
              </FieldActionWrapper>
            }
          />
          <FieldHint />
          <FieldError />
        </Stack>
      </Field>
    </Box>
  )
}

export default Input
