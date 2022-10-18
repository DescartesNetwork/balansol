import IonIcon from '@sentre/antd-ionicon'

type AvatarUploadedProps = {
  children: JSX.Element
  onRemove?: () => void
  iconSize?: number
}

const AvatarUploaded = ({
  children,
  onRemove,
  iconSize = 14,
}: AvatarUploadedProps) => {
  return (
    <div className="avatar-uploaded" style={{ height: '100%' }}>
      <div className="avatar" style={{ height: '100%' }}>
        {children}
      </div>
      <IonIcon
        onClick={onRemove}
        className="remove-icon"
        name="trash-outline"
        style={{ fontSize: iconSize }}
      />
    </div>
  )
}

export default AvatarUploaded
