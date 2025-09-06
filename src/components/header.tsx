import Image from "next/image";

const Header = () => {
    return (
    <header className="l-header js-header-fixed">
        <div className="l-header-inner">
                    <p className="p-logo"><a href="/"><Image src="/img/logo.png" alt="岡山駅前のメイドカフェ「ふぇありーめいど ～妖精だってお給仕したい～」" width={1200} height={600}/></a></p>
                    <nav className="l-global-nav">
                <div className="l-global-nav__inner">
                    <ul className="p-global-nav">
                        <li><a href="/">ホーム</a></li>
                        <li><a href="/concept">コンセプト</a></li>
                        <li><a href="/system">システム</a></li>
                        <li><a href="/menu">メニュー</a></li>
                        <li><a href="/contact">お問い合わせ</a></li>
                    </ul>
                </div>
            </nav>
        </div>
    </header>
)}

export default Header;