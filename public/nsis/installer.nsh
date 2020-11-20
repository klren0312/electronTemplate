!macro customHeader

!macroend

!macro preInit

!macroend

!macro customInit
  # guid=53fe4cba-120d-4851-3cdc-dccb3a469019
  ReadRegStr $0 HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{53fe4cba-120d-4851-3cdc-dccb3a469019}" "UninstallString"
  ${If} $0 != ""
      MessageBox MB_ICONINFORMATION|MB_TOPMOST  "检测到系统中已安装本程序，将卸载旧版本" IDOK
      # ExecWait $0 $1
  ${EndIf}
!macroend

!macro customInstall
  DetailPrint 'Register testapp URI Handler'
  DeleteRegKey HKCR 'testapp'
  WriteRegStr HKCR 'testapp' '' 'URL:testapp'
  WriteRegStr HKCR 'testapp' 'URL Protocol' ''
  WriteRegStr HKCR 'testapp\shell' '' ''
  WriteRegStr HKCR 'testapp\shell\Open' '' ''
  WriteRegStr HKCR 'testapp\shell\Open\command' '' '$INSTDIR\${APP_EXECUTABLE_FILENAME} %1'
!macroend

!macro customInstallMode
  # set $isForceMachineInstall or $isForceCurrentInstall
  # to enforce one or the other modes.
  #set $isForceMachineInstall
!macroend

!macro customUnInstall
  DeleteRegKey HKCR 'testapp'
!macroend
