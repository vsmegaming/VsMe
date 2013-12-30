#README

##Running the app locally

Prerequisites:
- Ruby
- rbenv or rvm
- Homebrew

```bash
git clone git@github.com:vsmegaming/VsMe.git
gem install bundler
bundle
```

Then we need to install postgres

```bash
brew install postgresql
initdb /usr/local/var/postgres
pg_ctl -D /usr/local/var/postgres -l /usr/local/var/postgres/server.log start
rake db:setup
```

