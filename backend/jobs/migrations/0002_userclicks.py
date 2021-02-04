# Generated by Django 3.0.6 on 2021-02-01 16:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserClicks',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('path', models.CharField(blank=True, max_length=240)),
                ('number_of_clicks', models.SmallIntegerField(default=0)),
            ],
        ),
    ]
