import Image from "next/image";

const Footer = () => {
    return (
        <footer className="l-footer">
            <p className="p-logo-footer"><div className="flex justify-center"><Image src="/img/logo.png" alt="岡山駅前のメイドカフェ「ふぇありーめいど ～妖精だってお給仕したい～」" width={1200} height={600} /></div></p>
            <p className="p-address">〒710-0842 岡山県倉敷市吉岡330<br />
                倉敷南高等学校<br />
                TEL：<a href="tel:0864230600">086-423-0600</a></p>
            <p className="p-address">【営業時間】<br />
                <strong className="u-color-pink">葦岡祭4日目</strong><br />
                09/04 09:00～15:00</p>
            <p className="p-copyright">&copy; 2025 倉敷南高等学校3-2</p>
        </footer>
    )
}

export default Footer; 