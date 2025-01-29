class Config():
    DEBUG=False
    SQL_ALCHEMY_TRACK_MODIFICATIONS=False

class LocalDevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI="sqlite:///database.sqlite3"
    DEBUG=True
    SECURITY_PASSSWORD_HASH='bcrypt'
    SECURITY_PASSSWORD_SALT='thisshouldbekeptsecret'
    SECRET_KEY='shouldbekepthidden'
    WTF_CSRF_ENABLED=False