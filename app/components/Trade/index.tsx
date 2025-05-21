import Image from "next/image";


const Trade = () => {
    return (
        <div className="mx-auto max-w-7xl mt-48 mb-16 px-6 relative">
            <div className="radial-bgone hidden lg:block"></div>

            <div className="grid lg:grid-cols-2 gap-x-5">
                {/* Column-1 */}
                <div>
                    <Image src={'/images/Trade/macbook.png'} alt="macBook-image" width={787} height={512} />
                </div>

                {/* Column-2 */}

                <div>
                    <h3 className="text-3xl lg:text-5xl font-semibold text-offwhite mb-6 text-center sm:text-start">R O A D M A P</h3>
                    <p className="lg:text-lg font-normal text-lightblue mb-16 text-center sm:text-start">PinkyPromise is moving full speed ahead with its roadmap: after the successful launch of its $PKP token — now available for direct purchase on the official website — the team is currently focused on developing its core utilities, including the highly anticipated Aviator game and the international lottery platform. This phase reinforces the project’s vision of delivering a decentralized, fun, and rewarding experience for its community.</p>
                    <div className="flex justify-between">
                        <Image src={'/images/Trade/mac.svg'} alt="macOS-image" width={61} height={105} />
                        <div className="verticalLine"></div>
                        <Image src={'/images/Trade/appstore.svg'} alt="appstore-image" width={80} height={105} />
                        <div className="verticalLine"></div>
                        <Image src={'/images/Trade/windows.svg'} alt="windows-image" width={80} height={105} />
                        <div className="verticalLine"></div>
                        <Image src={'/images/Trade/android.png'} alt="android-image" width={71} height={105} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Trade;
