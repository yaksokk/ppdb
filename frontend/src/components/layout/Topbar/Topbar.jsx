import { Avatar } from '../../common'

function Topbar({ title = '', user = {} }) {
    return (
        <div className="h-[52px] bg-dark-blue border-b border-white/10 px-6
      flex items-center justify-between sticky top-0 z-[100] flex-shrink-0">


            <span className="text-[13px] font-bold text-white/85 font-poppins">
                {title}
            </span>


            <div className="flex items-center gap-2">
                <Avatar
                    name={user.name || 'User'}
                    size="sm"
                    style={user.avatarStyle}
                />
                <div>
                    <p className="text-[12px] font-semibold text-white leading-none">
                        {user.name || 'User'}
                    </p>
                </div>
            </div>

        </div>
    )
}

export default Topbar