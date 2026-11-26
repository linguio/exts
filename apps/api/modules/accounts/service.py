from psycopg import Connection

from modules.accounts import repository
from modules.accounts.schemas import Accounts, AccountsQuery


def list_accounts(database: Connection, query: AccountsQuery) -> Accounts:
    accounts, total = repository.read_accounts(
        database, query.page_size, query.page_index * query.page_size, query.email.strip(), query.name.strip(),
        query.start_date, query.end_date,
    )
    return Accounts(accounts=accounts, total=total, page_index=query.page_index, page_size=query.page_size)
