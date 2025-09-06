import Image from "next/image"

const Contact = () => {
    return (
        <div className="l-container-fluid u-bgcolor-gradient-rainbow">
                <div className="l-container">
                    <h2 className="p-title-center">チケットやその他のお問合せ</h2>
                    <div className="flex justify-center">
                        <dl className="p-contact">
                            <dt className="line">LINE公式アカウント</dt>
                            <dd>
                                <div className="p-line">
                                    <div className="p-line__content">
                                        <p className="p-line-text">チケットやその他のお問い合わせはこちらから！</p>
                                        <p className="u-mt20"><a href="https://lin.ee/OkAoPub" target="_blank" className="c-btn-line">友だち追加</a></p>
                                    </div>
                                    <div className="p-line__qr">
                                        <p><Image src="/img/qr_line.jpg" alt="LINE QRコード" width={380} height={380} /></p>
                                    </div>
                                </div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
    )
}

export default Contact;