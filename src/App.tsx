import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  Dialog,
  Slide,
  DialogTitle,
  DialogContent,
  Backdrop,
  CircularProgress
} from '@mui/material'
import TwitterIcon from '@mui/icons-material/Twitter'
import discordLogo from './discord-logo.png'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import React, { useState } from 'react'
import { TransitionProps } from '@mui/material/transitions'
import CloseIcon from '@mui/icons-material/Close'
import demoInfo from './demo-info.png'
import { useMutation, UseMutationOptions, UseMutationResult } from "react-query"
import axios from "axios"
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { AxiosResponse } from 'axios'

type AxiosError = {
  response?: {
    data?: {
      error?: {
        message?: string
      },
    }
    status?: number
  }
}

type UpdateUserInput = {
  discordName: string
  walletId: string
  magicCode: string
}

const useUpdateUserMutation = (
  options?: UseMutationOptions<AxiosResponse, AxiosError, UpdateUserInput>
): UseMutationResult<AxiosResponse, AxiosError, UpdateUserInput> => useMutation(
  async (input: UpdateUserInput) => await axios.post(
    'http://localhost:8000/submit-user',
    input,
  ),
  {...options}
)

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
})

const schema = yup
  .object({
    discordName: yup.string().required('Required'),
    walletId: yup.string().required('Required'),
    magicCode: yup.string().required('Required'),
  })
  .required()

const App = (): JSX.Element => {
  const [isOpenInfoDialog, setIsOpenInfoDialog] = useState<boolean>(false)
  const [isOpenSuccessDialog, setIsOpenSuccessDialog] = useState<boolean>(false)
  const {
    control,
    formState: { errors: formErrors },
    reset,
    handleSubmit
  } = useForm<UpdateUserInput>({
    mode: 'all',
    resolver: yupResolver(schema),
    defaultValues: {
      discordName: '',
      walletId: '',
      magicCode: ''
    }
  })
  const {
    mutate: updateUser,
    isLoading: isUpdatingUser,
    error: updateUserError
  } = useUpdateUserMutation({
    onSuccess: () => {
      setIsOpenSuccessDialog(true)
      reset()
    }
  })

  const onFormSubmit: SubmitHandler<UpdateUserInput> = (data) => {
    updateUser(data)
  }

  const updateUserErrorMessage = updateUserError
    ? `${updateUserError?.response?.data?.error?.message}`
    : undefined

  return (
    <Box>
      <Stack 
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        spacing={3}
        sx={{
          position: 'absolute',
          width: '100%',
          height: '45px',
          left: '0px',
          top: '0px',
          background: '#D9D9D9'
          }}
        >
          <TwitterIcon
            sx={{ color: 'black' }}
            onClick={() => window.location.replace('https://www.twitter.com/thisisraviee')}
          />
          <Box
            sx={{ paddingRight: '26px', width: '24px', height: '24px' }}
            component='img'
            src={discordLogo}
            alt="discord-icon"
            onClick={() => window.location.replace('https://discord.com/invite/xqAQ7jVfvs')}
          />
        </Stack>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Stack
            pt={4}
            pb={2}
            spacing={2}
            alignItems="center"
            sx={{ 
              background: '#FFFFFF',
              position: 'absolute',
              width: '100%',
              left: '0px',
              bottom: '0px',
              borderRadius: '24px 24px 0px 0px',
            }}
          >
            <Backdrop
              open={isUpdatingUser}
            >
              <CircularProgress />
            </Backdrop>
            <Box sx={{ width: '75%' }}>
              <Stack
                direction='row'
                alignItems="center"
                justifyContent="flex-end"
                sx={{ width: '100%' }}
                onClick={() => setIsOpenInfoDialog(true)}
              >
                <InfoOutlinedIcon sx={{ width: '12px', height: '12px', color: '#8D8D8D', marginRight: '5px' }} />
                <Typography variant='caption' sx={{ color: '#8D8D8D' }}>How to check Discord name</Typography>
              </Stack>
              <Controller
                control={control}
                name="discordName"
                render={({ field: { onChange, value, ref } }): JSX.Element => (
                  <TextField
                    inputRef={ref}
                    value={value}
                    onChange={onChange}
                    error={!!formErrors?.discordName}
                    helperText={formErrors?.discordName?.message}
                    required
                    inputProps={{ required: false, maxLength: 255 }}
                    label="Discord Name"
                    variant="outlined"
                    disabled={isUpdatingUser}
                    sx={{ width: '100%' }}
                  />
                )}
              />
            </Box>
              <Controller
                control={control}
                name="walletId"
                render={({ field: { onChange, value, ref } }): JSX.Element => (
                  <TextField
                    inputRef={ref}
                    value={value}
                    onChange={onChange}
                    error={!!formErrors?.walletId}
                    helperText={formErrors?.walletId?.message}
                    required
                    inputProps={{ required: false, maxLength: 255 }}
                    label="Wallet ID"
                    variant="outlined"
                    disabled={isUpdatingUser}
                    sx={{ width: '75%' }}
                  />
                )}
              />
              <Controller
                control={control}
                name="magicCode"
                render={({ field: { onChange, value, ref } }): JSX.Element => (
                  <TextField
                    inputRef={ref}
                    value={value}
                    onChange={onChange}
                    error={!!(formErrors?.magicCode || updateUserErrorMessage)}
                    helperText={formErrors?.magicCode?.message || updateUserErrorMessage}
                    required
                    inputProps={{ required: false, maxLength: 255 }}
                    label="Magic Code"
                    variant="outlined"
                    disabled={isUpdatingUser}
                    sx={{ width: '75%' }}
                  />
                )}
              />
            <Button
              type="submit"
              variant='contained'
              sx={{
                background: 'linear-gradient(229.11deg, #AE47FF 9.43%, #47B2FF 132.33%)',
                borderRadius: '12px',
                padding: '8px 40px 8px 40px',
                textTransform: 'capitalize',
              }}
            >
              <Typography variant='h5'>Confirm</Typography>
            </Button>
            <Typography variant="caption" sx={{ padding: '0 40px 0 20px', color: '#8D8D8D' }}>
              <ul>
                <li>กรุณากรอกโค้ดหลังจากได้รับในงาน The Moon NFT Show ภายใน 1 เดือน (กรอกโค้ดก่อนวันที่ 31 กรกฎาคม 2565)</li>
                <li>1 โค้ดสามารถใช้ได้ 1 ครั้งเท่านั้น จะไม่สามารถกรอกโค้ดที่เคยใช้ไปแล้วได้</li>
                <li>หากได้รับคูปองแล้วไม่สามารถกรอกโค้ดได้ หรือเกิดความผิดพลาดขณะกรอก กรุณาติดต่อ Twitter @thisisraviee</li>
                <li>การตัดสินของ Creator ถือเป็นที่สิ้นสุด</li>
              </ul>
            </Typography>
            <Typography variant="caption" sx={{ opacity: '0.2' }}>LITTLE MAGIC SCHOOL</Typography>
          </Stack>
        </form>
        <Dialog
          open={isOpenInfoDialog}
          TransitionComponent={Transition}
          keepMounted
          sx={{
            '.MuiPaper-root': {
              borderRadius: '20px'
            }
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            <CloseIcon
              onClick={() => setIsOpenInfoDialog(false)}
              sx={{ color: '#8D8D8D' }}
            />
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <Typography variant='caption'>Tap your name to copy from profile page.</Typography>
              <Box component='img' src={demoInfo} alt="demo-info" />
            </Stack>
          </DialogContent>
        </Dialog>
        <Dialog
          open={isOpenSuccessDialog}
          TransitionComponent={Transition}
          keepMounted
          sx={{
            '.MuiPaper-root': {
              borderRadius: '20px'
            }
          }}>
            <DialogTitle>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <Typography variant='h6'>Abracadabra!</Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Stack alignItems='center' spacing={2}>
                <Typography align='center'>
                  Your information has been recieved
                  Thank you for your participation
                  See you in Little Magic School!
                </Typography>
                <Button
                  type="submit"
                  variant='contained'
                  sx={{
                    background: 'linear-gradient(229.11deg, #AE47FF 9.43%, #47B2FF 132.33%)',
                    borderRadius: '24px',
                    textTransform: 'capitalize',
                    width: '120px'
                  }}
                  onClick={() => setIsOpenSuccessDialog(false)}
                >
                  <Typography variant='h6'>Done</Typography>
                </Button>
              </Stack>
            </DialogContent>
          </Dialog>
    </Box>
  );
}

export default App;
