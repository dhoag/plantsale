from django.contrib.auth.models import BaseUserManager


class StakeholderManager(BaseUserManager):
    def create_user(self, email, password=None):
        user = self.model( email=email.lower() )
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password, **kwargs):
        user = self.create_user(email, password, **kwargs)
        user.is_superuser = True
        user.is_admin = True
        user.save(using=self._db)

        return user
