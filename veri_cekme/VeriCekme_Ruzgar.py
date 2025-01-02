import time
import chromedriver_autoinstaller
from selenium import webdriver
from selenium.webdriver.common.by import By
import psycopg2

# ChromeDriver'ı otomatik olarak indirip yükleyin
chromedriver_autoinstaller.install()

# Selenium WebDriver'ı başlatın
driver = webdriver.Chrome()

# Hedef URL'yi açın
url = "https://www.enerjiatlasi.com/ruzgar-enerjisi-haritasi/turkiye"
driver.get(url)

# Sayfanın yüklenmesini bekleyin
time.sleep(5)  # Sayfanın tamamen yüklenmesini sağlamak için 5 saniye bekliyoruz

# İstediğiniz verileri çekecek XPath'leri kullanarak gerekli bilgileri alın
il_xpath = '//*[@id="article"]/table/tbody/tr/td[2]/a'  # Tablo satırlarının ilk hücresindeki illeri almak için
kurulu_gucleri_xpath = '//*[@id="article"]/table/tbody/tr/td[4]'  # Tablo satırlarının ikinci hücresindeki kurulu güçleri almak için

iller = driver.find_elements(By.XPATH, il_xpath)
kurulu_gucleri = driver.find_elements(By.XPATH, kurulu_gucleri_xpath)

# PostgreSQL bağlantı bilgileri
DB_HOST = "localhost"
DB_NAME = "db_energy"  # Veritabanı adınızı yazın
DB_USER = "postgres"  # PostgreSQL kullanıcı adınızı yazın
DB_PASSWORD = "0"  # PostgreSQL şifrenizi yazın

# PostgreSQL veritabanına bağlan
conn = psycopg2.connect(
    host=DB_HOST,
    dbname=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD
)

# Cursor oluştur
cur = conn.cursor()

# İlleri ve kurulu güçleri veritabanına kaydet
for il, kurulu_guc in zip(iller, kurulu_gucleri):
    try:
        # Kurulu gücü float'a çeviriyoruz, eğer boş veya geçersizse 0.0 olarak kabul ediyoruz
        kurulu_guc_value = float(kurulu_guc.text.replace('.', '').replace(',', '.'))  # boşlukları kaldırıp virgülü noktaya çeviriyoruz
    except ValueError:
        kurulu_guc_value = 0.0  # Eğer kurulu güç değeri geçersizse 0.0 olarak kabul ediyoruz

    # Veriyi veritabanına ekle
    cur.execute("""
        INSERT INTO ruzgar_enerjisi (il, kurulu_guc)
        VALUES (%s, %s)
    """, (il.text, kurulu_guc_value))

# Değişiklikleri kaydet ve bağlantıyı kapat
conn.commit()
cur.close()
conn.close()

# WebDriver'ı kapat
driver.quit()

print("Veriler başarıyla çekildi ve PostgreSQL veritabanına kaydedildi!")
